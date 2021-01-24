const {promisify} =require("util")
const figlet =promisify(require("figlet"))//打印欢迎节面
const clear =require("clear") //清屏终端

const chalt=require("chalk")//粉笔改变打印到终端的颜色
const {clone} =require("../lib/download")
const { resolve } = require("path")
const log=content=>console.log(chalt.green(content))
const open =require("open")

//1.输出流可以引入主进程输出流（打印的日志可以在主进程中查看到）
//2.转换成promise风格
const spawn=async (...args)=>{
    const {spawn} =require("child_process")//创建子进程去执行脚本安装依赖
    const options=args[args.length-1]
    if(process.platform==="win32"){
        log("win32")
        options.shell=true
    }else{
        log("Linux/Unix")
    }
    return new Promise(resolve=>{
        const proc=spawn(...args)//执行spawn
        proc.stdout.pipe(process.stdout)//将子进程的输出流链接上主进程的输出流
        proc.stderr.pipe(process.stderr)//将子进程的错误流连接上主进程的错误流
        proc.on("close",()=>{
            resolve()//执行完成执行回调
        })
    })
}
module.exports=async name=>{
    //打印欢迎界面
    clear()
    const data =await figlet("my vue welcome!")
    log(data)
    //下载工程 在git上
    log("创建项目" +name)
    // await clone('github:su37josephxia/vue-template', name)//从github下载到指定文件夹中
    
    //安装依赖 执行cnpm i
    log("安装依赖中。。")
    // await spawn("cnpm",["install"],{cwd:`./${name}`})//1.命令2.参数3.在哪个文件夹执行
    log(`安装完成：
    =============
    cd ${name}
    npm run serve
    =============
    `)
    // 打开浏览器
    open("http://localhost:8080")
    await spawn("npm",["run","serve"],{cwd:`./${name}`})//开启服务器
    //命令，参数，在哪个文件夹下执行
}