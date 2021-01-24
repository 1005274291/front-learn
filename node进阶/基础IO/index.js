//内存cpu很快 速度ns级  硬盘网络ms级
//node 由C语言编写 遇到IO挂起放到EventLoop中操作，，操作完成重新处理

const fs =require("fs")
const {promisify} =require("util") //将函数转换成promise风格 方便捕捉错误和回调

// const readFile=promisify(fs.readFile)
//同步读取 读取的是二进制
const data =fs.readFileSync("./stream.js")
// console.log(data.toString())

//异步读取  读取过程很慢，通过回调通知,错误优先的回调 
fs.readFile("./stream.js",(err,data)=>{
    if(err) throw err
    // console.log(data.toString())
})


//async函数 在执行同步函数的时候正常执行，遇到await时只有后跟promise时会阻塞当前函数不会阻塞其他的函数 不跟promise不会阻塞


const buf1=Buffer.alloc(10) //分配十个字节的内存空间  一个字节8bit 由两个16进制组成
const buf2=Buffer.from("a") //采用的Unicode编码 UTF-8存储 一种变长的存储 英文字母是一个字节 正好是a的asc码
const buf3=Buffer.from("一")//采用1-6个字节存储
//二进制合并 
const buf4=Buffer.concat([buf2,buf3])
// console.log(buf1,buf2,buf3,buf4)
// const iconv=require("iconv-lite")  解码gbk等
// const html =iconv.decode(body,"gb2312")


const http =require("http")
const server =http.createServer((req,res)=>{
    //创建一个http服务器，有人向服务器发出请求的时候才会调
    //req 请求流 res响应流
    const {url,method,headers}=req
    console.log(url)
    if(url ==="/" && method ==="GET"){
        //主页
        fs.readFile("./index.html",(err,data)=>{
            if(err){
                res.writeHead(500,{
                    "Content-Type":"text/plain;charset=utf-8"//由于要返回文本说明需要指定mime类型和编码
                })
                res.end("500 服务器挂了")  //结束响应流
            }
            res.statusCode=200
            res.setHeader("content-Type","text/html")
            res.end(data) //end支持传递二进制数据 
        })
    }else if(url ==="/users" && method ==="GET"){
        res.writeHead(200,{
            "Content-Type":"application/json"
        })
        res.end(JSON.stringify({
            name:"jun"
        }))
    }else if(method ==="GET" && headers.accept.indexOf("image/*")!==-1){
        //accept表示浏览器可以接收的类型
        //如果把图片读到内存，再从内存写到响应流中非常的消耗内存
        //所以创建一个管道，直接将读端连接文件，写端连接响应流
        fs.createReadStream("."+url).pipe(res)
    }else{
        res.writeHead(404)
    }
})

server.listen(3000)


//扒原型链
function getProtoTypeChain(obj){
    const protoChain=[]
    while (obj=Object.getPrototypeOf(obj)){
        protoChain.push(obj)
    }
    return protoChain
}