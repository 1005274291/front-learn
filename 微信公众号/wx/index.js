const Koa = require("koa");
const Router = require("koa-router");
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const app = new Koa();
app.use(bodyParser());
const router = new Router();
app.use(static(__dirname + "/"));
const axios = require("axios");
const conf = require("./conf");

const wechat = require("co-wechat");//处理公众号接收消息发送消息

router.all(
  "/wechat",
  wechat(conf).middleware(
    //需要conf中得token去验证是否是微信服务器得请求
    //一旦有人调用wechat会触发回调，接收的是消息对象
    async (message) => {
      console.log("message", message);
      return "Hello" + message.Content;
    }
  )
);
const tokenCache = {
  access_token: "",
  updateTime: Date.now(),
  expires_in: 7200,
};
// router.get("/getTokens",async ctx=>{
//     //请求微信服务器去获取token
//     const wxDomain="https://api.weixin.qq.com"
//     const path="/cgi-bin/token"
//     const params = `?grant_type=client_credential&appid=${conf.appid}&secret=${conf.appsecret}`;//用于获取access_token
//     const url =`${wxDomain}${path}${params}`
//     const res=await axios.get(url)
//     Object.assign(tokenCache,res.data,{
//         updateTime:Date.now()
//     })
//     ctx.body=res.data
// })
// //获取关注者列表
// router.get("/getFollowers",async ctx=>{
//     const url =`https://api.weixin.qq.com/cgi-bin/user/get?access_token=${tokenCache.access_token}`
//     const res=await axios.get(url)
//     ctx.body=res.data
// })

//借用微信库去发向微信服务器起请求api
const WechatAPI = require("co-wechat-api");

const { ServerToken,ClientToken } = require("./mongoose");
const api = new WechatAPI(
  conf.appid,
  conf.appsecret,
  async function () {
    //去哪里找access_token
    return await ServerToken.findOne();
  },
  async function (token) {
      //把token存到哪
    const res = await ServerToken.updateOne({}, token, { upsert: true });//如果没有这条信息会新追加这条信息
  }
);
//获取关注者信息
router.get('/getFollowers', async ctx => {
    //用对象去请求用户列表
    var res = await api.getFollowers();
    //用openid去请求用户信息
    res = await api.batchGetUsers(res.data.openid, 'zh_CN');
    console.log('res', res)
    ctx.body = res
})

//获取jsConfig用于验证，使得前端可以使用jssdk调用native的能力
router.get("/getJsConfig",async ctx=>{
  console.log("getJSSDK..",ctx.query)
  var res=await api.getJsConfig(ctx.query)
  console.log("res",res)
  ctx.body=res
})

//微信认证

const OAuth=require("co-wechat-oauth")//微信第三方登录
const oauth=new OAuth(conf.appid,conf.appsecret,async function(openid){
  //根据openid取token 
  return await ClientToken.getToken(openid)
},async function(openid,token){
  //如果不自定义函数会将信息存储到内存
  return await ClientToken.setToken(openid,token)
})
//接收前端微信登录的请求，去请求微信的服务器
router.get("/wxAuthorize",async (ctx,next)=>{
  const state=ctx.query.id//可以接收前端的数据
  let redirectUrl=ctx.href
  //拼接回调地址
  redirectUrl=redirectUrl.replace("wxAuthorize","wxCallback")
  const scope="snsapi_userinfo" //需要用户同意授权可以获取更多的用户信息
  const url =oauth.getAuthorizeURL(redirectUrl,state,scope)
  console.log("跳转地址:",url);
  ctx.redirect(url)
})


//接收回调
router.get("/wxCallback",async (ctx,next)=>{
  const code =ctx.query.code //获取到授权码
  console.log("AccessCode",code)
  const token =await oauth.getAccessToken(code)//获取到token
  const accessToken =token.data.access_token
  const openid=token.data.openid//获取到openid
  ctx.redirect("/?openid="+openid)//带着用户id重定向回去
})


// 获取用户信息

router.get("/getUser",async(ctx,next)=>{
  const openid =ctx.query.openid
  const userinfo=await oauth.getUser(openid)
  ctx.body=userinfo
})
app.use(router.routes()); /*启动路由*/
app.use(router.allowedMethods());
app.listen(3000);
