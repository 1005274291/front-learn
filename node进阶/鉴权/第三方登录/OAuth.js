//例如王者荣耀没有自己的用户系统，可以使用微信授权登录，使用QQ授权登录等，让第三方的账户系统告诉自己的服务器用户是谁

//浏览器像服务器发起认证请求，服务器会将用户重定向到第三方认证，用户输入账号密码像第三方发起认证同时携带自身服务器的地址。
//第三方服务器认证通过会将回调发送给服务器并返回认证code，服务器用认证code像第三方登录系统申请令牌，第三方登录系统返回令牌给服务器，服务器刷新页面

const Koa =require("koa")
const router =require("koa-router")()
const static =require("koa-static")
const app=new Koa()
const axios=require("axios")
const querystring=require("querystring")

app.use(static(__dirname+"/"))

const config={
    client_id:"733c997d8f411741921e",
    client_secret:"ab7248849ff326697256f44829584f6f388dd107"
}

router.get("/github/login",async ctx=>{
    //重定向到第三方登录服务器
    let path=`https://github.com/login/oauth/authorize`
    path +=`?client_id=${config.client_id}`

    //携带client_id让第三方服务器知道是哪个客户端申请的开放授权
    ctx.redirect(path)
})

router.get("/auth/github/callback",async ctx=>{
    console.log("callback ...")
    const {code} =ctx.query
    console.log('code:',code)
    const params ={
        client_id:config.client_id,
        client_secret:config.client_secret,
        code:code
    }
    let ret =await axios.post("https://github.com/login/oauth/access_token",params)

    const {access_token}=querystring.parse(ret.data)
    console.log("token",access_token)
    ret =await axios.get(`https://api.github.com/user?access_token=${access_token}`)
    console.log("user:",ret.data)
    ctx.body=`
        <h1>Hello ${ret.data.login}</h1>
    `
})

app.use(router.routes())
app.listen(7001)