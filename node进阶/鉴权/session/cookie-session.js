//redis是高性能的基于内存的key-value数据库
//Redis支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。

const Koa = require("koa");
const router = require("koa-router")();
const session = require("koa-session");
const cors = require("koa2-cors");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
const app = new Koa();

//配置session的中间件
app.use(
  cors({
    credentials: true, //允许其他域的cookie
  })
);
app.keys = ["some secret"];

app.use(static(__dirname + "/"));
app.use(bodyParser());
app.use(session(app));

app.use((ctx, next) => {
  //只放行login接口，其他页面都要检查session
  if (ctx.url.indexOf("login") > -1) {
    next();
  } else {
    console.log("session", ctx.session.userinfo);
    if (!ctx.session.userinfo) {
      ctx.body = {
        message: "登录失败",
      };
    } else {
      next();
    }
  }
});
router.post('/login', async (ctx) => {
    const {
        body
    } = ctx.request
    //设置session
    ctx.session.userinfo = body.username;
    ctx.body = {
        message: "登录成功"
    }
})
router.post('/logout', async (ctx) => {
    //设置session
    delete ctx.session.userinfo
    ctx.body = {
        message: "登出系统"
    }
})
router.get('/getUser', async (ctx) => {
    ctx.body = {
        message: "获取数据成功",
        userinfo: ctx.session.userinfo//获取对应的session
    }
})


app.use(router.routes())
app.listen(3000)