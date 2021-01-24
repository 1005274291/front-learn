const { setTimeout } = require("timers")
const Koa = require("./mykoa")
const app = new Koa()
const Router = require("./myrouter")
const router = new Router()
// app.use(async (ctx,next)=>{ //ctx.Request获取koa封装的request，ctx.req获取http原生req（res也一样）
//     const start =Date.now()
//     await next() //调用下一个usecallback
//     const end=Date.now()
//     console.log(`请求${ctx.url} 耗时${parseInt(end-start)}ms`)
// })

// app.use((ctx)=>{
//     // ctx.body=[{
//     //     name:"tom"
//     // },{
//     //     name:"jerry"
//     // }]
//     ctx.body="hah"
// })
//注册路由到router实例中
router.get('/index', async ctx => { ctx.body = 'index page'; });
router.get('/post', async ctx => { ctx.body = 'post page'; });
router.get('/list', async ctx => { ctx.body = 'list page'; });
router.post('/index', async ctx => { ctx.body = 'post page'; });
//导出实例所有的路由
app.use(router.routes());


const delay = () => new Promise(resolve => setTimeout(() => resolve(), 1000)) //延时一秒执行resolve
app.use(async (ctx, next) => {
    ctx.body += "1"
    await next()
    ctx.body += "5"
})
app.use(async (ctx, next) => {
    ctx.body += "2"
    await delay()
    await next()
    ctx.body += "4"
})
app.use(async (ctx, next) => {
    ctx.body += "3"
})
app.listen(3000, () => {
    console.log("koa start 3000")
})