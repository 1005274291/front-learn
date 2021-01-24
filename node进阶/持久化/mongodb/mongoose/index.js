const Koa =require("koa")
const app =new Koa()
//加载模型
const config =require("./conf")
const {loadModel} =require("./framework/loader")
loadModel(config)(app)
//自动的根据模型生成一套api接口
const bodyParser =require("koa-bodyparser")
app.use(bodyParser())
app.use(require("koa-static")(__dirname+"/"))
const restful=require("./framework/router")
app.use(restful)

app.listen(3000,()=>{
    console.log("3000 start!")
})