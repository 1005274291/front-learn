const {Service}=require("egg")//逻辑复用
const nodemailer =require("nodemailer")//可以发送邮件的第三方库
const path =require("path")
const fse= require("fs-extra")

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
    async mergeFile(filepath,hash,size){
        //合并文件切片
        const chunkDir=path.resolve(this.config.UPLOAD_Dir,hash)//切片文件夹
        let chunks =await fse.readdir(chunkDir)//读取切片文件夹下的文件返回文件名列表
        chunks.sort((a,b)=>{
            return a.split('-')[1]-b.split("-")[1]
        })//按照升序排序
        chunks=chunks.map(chunk=>path.resolve(chunkDir,chunk))//切片文件名转换成绝对路径
        await this.mergeChunks(chunks,filepath,size)//切片全部合入
        fse.rmdirSync(chunkDir)
    }
    async mergeChunks(chunks,filepath,size){
        const pipStream=(filepath,writeStream)=>new Promise(resolve=>{
            //接收一个可读的文件和一个写入的流
            const readStream =fse.createReadStream(filepath)//创建可读流
            readStream.on('end',()=>{
                fse.unlinkSync(filepath)//这个切片合入文件后删除
                resolve()
            })
            readStream.pipe(writeStream)//流对接
        })
        await Promise.all(
            chunks.map((file,index)=>{
                return pipStream(file,fse.createWriteStream(filepath,{
                    start:index*size,
                    end:(index+1)*size
                }))
            })
        )
    }
}

module.exports=ToolService