const svgCaptcha = require("svg-captcha")//生成svg验证码的库
const BaseController = require("./base")
const fse = require("fs-extra")//处理文件
const path = require("path")
class UtilsController extends BaseController {
  //处理图形验证码
  async captcha() {
    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3
    })
    // console.log(captcha.text)
    this.ctx.session.captcha = captcha.text
    this.ctx.response.type = "image/svg+xml"
    this.ctx.body = captcha.data
  }
  //处理邮箱验证码
  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    let code = Math.random().toString().slice(2, 6)//生成随机的四位安全码
    console.log('邮箱：' + email + "验证码：" + code)
    ctx.session.emailcode = code
    //定义要发送邮件的内容
    const subject = "开课吧验证码"
    const text = "此验证码用于登录使用"
    const html = `<h2>小开社区</h2><a href="https://kaikeba.com"><span>${code}</span></a>`

    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSend) {
      this.message("发送成功")
    } else {
      this.error("发送失败")
    }
  }
  //处理上传的邮件
  async uploadfile() {
    const { ctx } = this
    const file = ctx.request.files[0]
    const { name, hash } = ctx.request.body
    const chunkPath = path.resolve(this.config.UPLOAD_Dir, hash)//当前切片所在的文件夹
    if (!fse.existsSync(chunkPath)) {
      //如果当前文件夹不存在就创建文件夹
      await fse.mkdir(chunkPath)
    }

    await fse.move(file.filepath, `${chunkPath}/${name}`)
    this.message("切片上传成功")
  }
  //处理切片合并成文件
  async mergefile() {
    const { ext, size, hash } = this.ctx.request.body
    const filepath = path.resolve(this.config.UPLOAD_Dir, `${hash}.${ext}`)//合并文件后的地址
    await this.ctx.service.tools.mergeFile(filepath, hash, size)
    this.success({
      url: `/public/${hash}.${ext}`
    })
  }
  //处理文件是否存在，如果不存在文件切片是否存在
  async checkfile() {
    const { ctx } = this
    const { ext, hash } = ctx.request.body
    const filepath = path.resolve(this.config.UPLOAD_Dir, `${hash}.${ext}`)//目标文件
    let uploaded = false
    let uploadedList = []
    if (fse.existsSync(filepath)) {
      //文件存在
      uploaded = true
    } else {
      uploadedList = await this.getUploadedList(path.resolve(this.config.UPLOAD_Dir, hash))
    }

    this.success({
      uploaded,
      uploadedList
    })
  }
  //处理文件夹下的切片
  async getUploadedList(dirPath) {
    return fse.existsSync(dirPath)
      ? (await fse.readdir(dirPath).filter(name => name[0] !== '.'))//剔除隐藏文件
      : []
  }
}

module.exports = UtilsController