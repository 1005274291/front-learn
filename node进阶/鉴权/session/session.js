//session会话机制是一种服务端机制，它类似于哈希表的结构来保存信息
// 在客户端第一次访问服务端的时候，服务端会创建session，然后保存session(可以保存在内存中，也可以保存在数据库(redis)中)
// 给这个session生成一个唯一标识sessionId，在响应头种下这个唯一标识
// 对session签名可以防止客户端篡改session，用服务端的密钥对sid进行签名处理
// 浏览器收到服务端的响应会解析响应头，将sid保存在cookie中，浏览器再下次请求的请求头会带上域名下的cookie信息
// 服务端会解析cookie中的sid，去session中寻找查看是否合法

// session存储在内存
const koa =require("koa")
const app =new koa()
const session=require("koa-session")

//采用hmac算法进行hash签名，对session的cookie进行签名
app.keys=["some secret"]

//配置项
const SESS_CONFIG={
    key:"jsessionid",//cookie键名
    maxAge:86400000,//有效期，默认一天
    httpOnly:true,//今服务器可修改，js获取不到
    signed:true//对cookie进行签名，会像客户端注入两个cookie，一个是sid（base64编码ey开头），一个是签名(无法解码)
    //{"count":1,"_expire":1607252642182,"_maxAge":86400000} 客户端存储着session的值 为了共享session
}

//注册
app.use(session(SESS_CONFIG,app))

//测试
app.use(ctx=>{
    if (ctx.path === '/favicon.ico') return;
    //获取session(没有就初始化)
    let n=ctx.session.count||0
    //设置session
    ctx.session.count=++n
    ctx.body='第' + n + '次访问';
})

app.listen(3000)