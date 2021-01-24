const redis = require('redis')
const redisClient = redis.createClient(6379,'localhost')
const redisStore = require('koa-redis');
const koa =require("koa")
const session=require("koa-session")
const wrapper =require("co-redis")//将redis编程primise风格
const client =wrapper(redisClient)//获取一个redis的客户端
const app=new koa()
app.keys=["some secret"]

const SESS_CONFIG={
    key:"jsessionid",
    maxAge:86400000,
    httpOnly:true,
    signed:true,
    store:redisStore({client})//采用redis存储session 这时存储在客户端的就是uuid了
}

app.use(session(SESS_CONFIG,app))


app.use(async (ctx,next)=>{
    //把所有redis的值打印出来
    const keys =await client.keys("*")
    keys.forEach(async key =>{
        console.log(await client.get(key))
    })
    await next()
})

//client.set('hello','This is a value');设置数据
//client.get('hello',function (err,v) { console.log("redis get ",v); })读取数据