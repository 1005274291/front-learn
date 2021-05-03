//应用1的服务器
const express =require("express")

const app =express()

//为了让基座应用的前端页面访问该应用的服务器需要设置跨域
app.get("*",function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","PUT,GET,POST,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Headers","X-Requested-With")
    res.header("Access-Control-Allow-Headers","Content-Type")
    next()
})
app.use(express.static("./app1"))


app.listen(9001,()=>{
    console.log("应用一服务已经打开")
})
