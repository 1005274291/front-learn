//user分组路由的逻辑处理
const BaseController = require("./base")
const md5 = require("md5")
const jwt = require("jsonwebtoken")

const createRule = {
    email: { type: 'email' },
    nickname: { type: 'string' },
    passwd: { type: 'string' },
    captcha: { type: "string" }
}
const Hashsalt = "junbao666!"
class UserController extends BaseController {
    async login() {
        const { ctx, app } = this
        const { email, captcha, passwd, emailcode } = ctx.request.body
        if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
            //验证码校验不通过 
            return this.error("验证码错误")
        }
        if (emailcode !== ctx.session.emailcode) {
            return this.error("邮箱验证码错误")
        }
        const user = await ctx.model.User.findOne({
            email,
            passwd: md5(passwd + Hashsalt)
        })
        if (!user) {
            //没有这个用户
            return this.error("用户名密码错误")
        }
        //有这个用户就将用户的信息进行签名生成token作为保持登录的验证信息
        const token = jwt.sign({
            _id: user._id,
            email,
        }, app.config.jwt.secret, {//用于签名的后端密钥
            expiresIn: '1h'//token的有效期
        })
        this.success({ token, email, nickname: user.nickname })
    }

    async register() {
        const { ctx } = this
        try {
            //校验传递的参数
            ctx.validate(createRule)
        } catch (e) {
            //传递参数报错
            return this.error("传参校验失败", -1, e.error)
        }
        const { email, passwd, captcha, nickname } = ctx.request.body
        if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
            //验证码校验成功后校验邮箱是否唯一 
            if (await this.checkEmail(email)) {
                this.error("邮箱重复了")
            } else {
                //邮箱没有重复可以执行入库操作
                const ret = await ctx.model.User.create({
                    email,
                    nickname,
                    passwd: md5(passwd + Hashsalt)
                })
                if (ret._id) {
                    //入库成功
                    this.message("注册成功")
                }
            }
        } else {
            this.error("验证码错误")
        }
    }
    async checkEmail(email) {
        //校验当前邮箱是否已经存在于数据库当中,如果存在返回用户信息
        const user = await this.ctx.model.User.findOne({ email })
        return user
    }
    async verify() {
        //校验用户名是否存在
    }
    async info() {
        const { ctx } = this
        const { email } = ctx.state
        const user = await this.checkEmail(email)
        if (user) {
            this.success(user)
        } else {
            this.error("不存在这个用户")
        }
    }
    async updateInfo() {
        const { ctx } = this
        const url = ctx.request.body.url

        await ctx.model.User.updateOne(
            { _id: ctx.state.userid },
            { avatar: url }
        )
        this.success()
    }
    //用户是否关注了参数用户
    async isfollow() {
        const { ctx } = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        // 我的follow字段李，有没有传来的这个用户id
        const isFollow = !!me.following.find(id => id.toString() === ctx.params.id)
        this.success({ isFollow })
    }
    //关注用户
    async follow() {
        const { ctx } = this

        const me = await ctx.model.User.findById(ctx.state.userid)
        const isFollow = !!me.following.find(id => id.toString() === ctx.params.id)
        if (!isFollow) {
            me.following.push(ctx.params.id)
            me.save()
            this.message('关注成功')
        }
    }
    //取消用户
    async cancelFollow() {
        const { ctx } = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        // 把用户从我的following数组中删掉
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.following.splice(index, 1)
            me.save()
            this.message('取消成功')
        }
        // let isFollow = !!me.following.find(id=> id.toString()===ctx.params.id)
        // if(!isFollow){
        //   me.following.push(ctx.params.id)
        //   me.save()
        //   this.message('关注成功')
        // }
    }
    //获取用户的关注列表
    async following() {
        const { ctx } = this
        const users = await ctx.model.User.findById(ctx.params.id).populate('following')
        this.success(users.following)
    }
    //获取用户的粉丝
    async followers() {
        const { ctx } = this
        const users = await ctx.model.User.find({ following: ctx.params.id })
        this.success(users)
    }
    //点赞
    async likeArticle() {
        const { ctx } = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        if (!me.likeArticle.find(id => id.toString() === ctx.params.id)) {
            me.likeArticle.push(ctx.params.id)
            me.save()
            await ctx.model.Article.findByIdAndUpdate(ctx.params.id, { $inc: { like: 1 } })
            return this.message('点赞成功')
        }
    }
    //取消点赞
    async cancelLikeArticle() {
        const { ctx } = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        const index = me.likeArticle.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.likeArticle.splice(index, 1)
            me.save()
            await ctx.model.Article.findByIdAndUpdate(ctx.params.id, { $inc: { like: -1 } })
            return this.message('取消点赞成功')
        }
    }
    //获取用户的喜欢和不喜欢列表
    async articleStatus() {
        const { ctx } = this
        const me = await ctx.model.User.findById(ctx.state.userid)
        console.log(me)
        const like = !!me.likeArticle.find(id => id.toString() === ctx.params.id)
        const dislike = !!me.disLikeArticle.find(id => id.toString() === ctx.params.id)
        this.success({
            like, dislike,
        })
    }
}
module.exports = UserController