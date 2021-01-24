const fs=require("fs")
const path=require("path")
const Router=require("koa-router")

//读取指定目录下面的文件并以回调函数的形式返回文件名和文件内容
function load(dir,cb){
    const url=path.resolve(__dirname,dir)
    const files=fs.readdirSync(url)
    files.forEach(filename=>{
        filename=filename.replace(".js","")
        const file=require(url+"/"+filename)
        cb(filename,file)
    })
}

//初始化路由
function initRouter(app){
    const router=new Router()
    load("routes",(filename,routes)=>{
        //计算前缀得出子路由
        const prefix=filename ==="index"?"":"/"+ filename
        //判断路由类型，若为函数就把app传进去
        routes=typeof routes=="function" ?routes(app) :routes
        //遍历路由并添加到路由器
        Object.keys(routes).forEach(key=>{
            const [method,path]=key.split(" ")
            //注册路由
            router[method](prefix+path,async ctx=>{
                //路由只支持传递中间件，并将ctx挂载到app上
                app.ctx=ctx
                await routes[key](app)//路由现在接收的是app
            })
        })

    })
    return router
}
//初始化控制器
function initController(app){
    const controllers={}
    load("controller",(filename,controller)=>{
        //添加路由
        controllers[filename]=controller(app)
    })
    return controllers
}
//初始化service层
function initService(app){
    const services={}
    load("service",(filename,service)=>{
        //添加路由
        services[filename]=service(app)
    })
    return services
}
//初始化配置项层
const Sequelize =require("sequelize")

function loadConfig(app){
    load("config",(filename,conf)=>{
        if(conf.db){
            //创建数据库实例并挂载到app上
            app.$db=new Sequelize(conf.db)
            //加载模型
            app.$model={}
            load("model",(filename,{schema,options})=>{
                app.$model[filename]=app.$db.define(filename,schema,options)//创建表和模型
            })
            //同步数据库
            app.$db.sync()
        }
        if(conf.middleware){
            conf.middleware.forEach(mid=>{
                const midPath=path.resolve(__dirname,"middleware",mid)
                app.$app.use(require(midPath))//用koa的实例加载中间件
            })
        }
    })
}
//初始化计时器
const schedule =require("node-schedule")
function initSchedule(){
    load("schedule",(filename,scheduleConfig)=>{
        schedule.scheduleJob(scheduleConfig.interval,scheduleConfig.handler)
    })
}
module.exports={
    initRouter,
    initController,
    initService,
    loadConfig,
    initSchedule
}