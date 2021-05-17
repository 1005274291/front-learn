const {Service}=require("egg")//逻辑复用
const nodemailer =require("nodemailer")//可以发送邮件的第三方库

const userEmail ="jiang18745291887@126.com"//发送者的邮箱
const transporter=nodemailer.createTransport({
    service:'126',
    secureConnection:true,//是否采用安全链接
    auth:{
        user:userEmail,
        pass:'EEZDRYFZJCQWFRFY'
    }
})

class ToolService extends Service{
    async sendMail(email,subject,text,html){
        const mailOptions={
            from:userEmail,
            cc:userEmail,//抄送
            to:email,
            subject,
            text,
            html
        }
        try{
            await transporter.sendMail(mailOptions)
            return true
        }catch(e){
            console.log("发送失败",e)
        }
    }
}

module.exports=ToolService