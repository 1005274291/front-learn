//token验证不需要服务器有状态、
//当客户端登录时，服务端接收到请求会验证账号密码，验证成功后服务端会生成一个令牌（token），再把这个token发送给客户端
//客户端收到token会把它存储起来，可以存在cookie里也可以存在localStorage里
//客户端每次请求都会带着签发的token
//服务端收到请求会验证token（Jwt会把token分成三份，第一份是token的类型，第二份时token数据，第三份是根据签两份和后端的密钥生成的签名）

const Koa = require("koa");
const router = require("koa-router")();
const static = require("koa-static");
const bodyParser = require("koa-bodyparser");
const app = new Koa();
const jwt = require("jsonwebtoken"); //json-web-token //生成token
const jwtAuth = require("koa-jwt"); //验证token

const secret = "it's a secret";
app.use(bodyParser());
app.use(static(__dirname + "/"));

router.post("/login-token", async (ctx) => {
  const { body } = ctx.request;
  //登录逻辑
  const userinfo = body.username;
  ctx.body = {
    message: "登录成功",
    user: userinfo,
    //生成token返回给客户端
    token: jwt.sign(
      {
        data: userinfo,
        //设置过期时间，单位为秒
        exp: Math.floor(Date.now() / 1000 + 60 * 60),
      },
      secret //hmac签名的密钥
    ),
  };
});
// jwt.verify(token,secret,opt) 验证token 验证是否过期，签名是否正确,把载荷解析出来放到state.user上
router.get(
  "/getUser-token",
  //拿到token 
  jwtAuth({
    secret,
  }),
  async (ctx) => {
    //验证通过
    //token存在state的user里面
    console.log(ctx.state)
    console.log(ctx.state.user);

    //获取token
    ctx.body = {
      message: "获取数据成功",
      userinfo: ctx.state.user.data,
    };
  }
);
app.use(router.routes())
app.use(router.allowedMethods())//allowedMethods处理的业务是当所有路由中间件执行完成之后,若ctx.status为空或者404的时候,丰富response对象的header头
app.listen(3000)


//token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoidGVzdCIsImV4cCI6MTYwNzE3NTAyNiwiaWF0IjoxNjA3MTcxNDI2fQ.gv49xf2woDcQZg5x4areo-VguXg-pe4N12UXVb0Hffc
