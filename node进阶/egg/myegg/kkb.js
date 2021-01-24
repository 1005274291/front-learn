const koa =require("koa")
const {initRouter,initController,initService,loadConfig,initSchedule} =require("./myloader")

class kkb{
    constructor(conf){
        //存储koa实例
        this.$app=new koa(conf)
        //加载配置项
        loadConfig(this)
        //注册controller
        this.$ctrl=initController(this)
        //注册service
        this.$service=initService(this)
        //执行定时任务
        initSchedule()
        //注册路由
        this.$router=initRouter(this)
        this.$app.use(this.$router.routes())
    }
    start(port){
        this.$app.listen(port,()=>{
            console.log("服务器启动成功 端口："+port)
        })
    }
}

module.exports=kkb