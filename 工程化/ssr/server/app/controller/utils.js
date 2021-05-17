const svgCaptcha =require("svg-captcha")//生成svg验证码的库
const BaseController=require("./base")
class UtilsController extends BaseController {
  async captcha() {
    const captcha=svgCaptcha.create({
      size:4,
      fontSize:50,
      width:100,
      height:40,
      noise:3
    })
    // console.log(captcha.text)
    this.ctx.session.captcha=captcha.text
    this.ctx.response.type="image/svg+xml"
    this.ctx.body=captcha.data
  }
  async sendcode(){
    const {ctx}=this
    const email =ctx.query.email
    let code =Math.random().toString().slice(2,6)//生成随机的四位安全码
    console.log('邮箱：'+email+"验证码："+code)
    ctx.session.emailcode=code
    //定义要发送邮件的内容
    const subject="开课吧验证码"
    const text ="此验证码用于登录使用"
    const html=`<h2>小开社区</h2><a href="https://kaikeba.com"><span>${code}</span></a>`

    const hasSend=await this.service.tools.sendMail(email,subject,text,html)
    if(hasSend){
      this.message("发送成功")
    }else{
      this.error("发送失败")
    }
  }
}

module.exports = UtilsController