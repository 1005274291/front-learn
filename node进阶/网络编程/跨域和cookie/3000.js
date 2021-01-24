const express =require("express")
const app=express()
const proxy =require("http-proxy-middleware").createProxyMiddleware
app.use(express.static(__dirname+"/")) //设置静态目录(访问首页的时候展示index.html)
app.use("/api",proxy({//将所有api接口的请求转发到4000端口
    target:"http://localhost:4000"
}))
app.listen(3000,()=>{
    console.log("3000端口开启")
})
//反向代理服务器
//用户访问服务器，服务器通过代理到其他多台服务器去处理

//正向代理服务器
//100台电脑 走代理服务器软件 在浏览器设置代理 所有人通过一个服务器去请求数据，可以进行缓存

