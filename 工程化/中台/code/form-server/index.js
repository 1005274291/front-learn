const Koa = require('koa');
const Router = require('koa-router');
const bodyparser = require('koa-bodyparser');

const Dao = require('./fileDao');
 
const app = new Koa();
const router = new Router();

app.use(bodyparser());

app.use((ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  ctx.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  ctx.set('Access-Control-Allow-Credentials', true);
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
    return;
  }
  next();
})

router
  // GET /form/:id  获取 form 元数据
  .get('/form/:id', (ctx, next) => {
    const { id } = ctx.params;
    const data = Dao.get(Number(id));
    console.log('id', id, 'data', data);
    ctx.body = data;
  })
  // PUT /form/:id  保存 form 元数据
  .put('/form/:id', (ctx, next) => {
    const { id } = ctx.params;
    const data = ctx.request.body;
    Dao.set(Number(id), data);
    ctx.status = 200;
    ctx.body = 'success';
  });
 
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(2333, () => console.log('server started at http://localhost:2333'));
