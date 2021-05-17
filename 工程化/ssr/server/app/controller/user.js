//user分组路由的逻辑处理
const BaseController=require("./base")
const md5 =require("md5")
const jwt=require("jsonwebtoken")

const createRule ={
    email:{type:'email'},
    nickname:{type:'string'},
    passwd:{type:'string'},
    captcha:{type:"string"}
}
const Hashsalt="junbao666!"
class UserController extends BaseController{
    async login(){
        const {ctx,app}=this
        const {email,captcha,passwd,emailcode}=ctx.request.body
        if(captcha.toUpperCase() !==ctx.session.captcha.toUpperCase()){
            //验证码校验不通过 
            return this.error("验证码错误")
        }
        if(emailcode!==ctx.session.emailcode){
            return this.error("邮箱验证码错误")
        }
        const user=await ctx.model.User.findOne({
            email,
            passwd:md5(passwd+Hashsalt)
        })
        if(!user){
            //没有这个用户
            return this.error("用户名密码错误")
        }
        //有这个用户就将用户的信息进行签名生成token作为保持登录的验证信息
        const token=jwt.sign({
            _id:user._id,
            email,
        },app.config.jwt.secret,{//用于签名的后端密钥
            expiresIn:'1h'//token的有效期
        })
        this.success({token,email,nickname:user.nickname})
    }

    async register(){
        const {ctx}=this
        try{
            //校验传递的参数
            ctx.validate(createRule)
        }catch(e){
            //传递参数报错
            return this.error("传参校验失败",-1,e.error)
        }
        const {email,passwd,captcha,nickname}=ctx.request.body
        if(captcha.toUpperCase()===ctx.session.captcha.toUpperCase()){
            //验证码校验成功后校验邮箱是否唯一 
            if(await this.checkEmail(email)){
                this.error("邮箱重复了")
            }else{
                //邮箱没有重复可以执行入库操作
                const ret=await ctx.model.User.create({
                    email,
                    nickname,
                    passwd:md5(passwd+Hashsalt)
                })
                if(ret._id){
                    //入库成功
                    this.message("注册成功")
                }
            }
        }else{
            this.error("验证码错误")
        }
    }
    async checkEmail(email){
        //校验当前邮箱是否已经存在于数据库当中,如果存在返回用户信息
        const user =await this.ctx.model.User.findOne({email})
        return user
    }
    async verify(){
        //校验用户名是否存在
    }
    async info(){
        const {ctx}=this
        const {email}=ctx.state
        const user=await this.checkEmail(email)
        if(user){
            this.success(user)
        }else{
            this.error("不存在这个用户")
        }
    }
}
module.exports=UserController