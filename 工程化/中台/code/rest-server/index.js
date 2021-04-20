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
  // GET  /api/:table/ table 的列表页
  // POST /api/:table/ 新增数据接口
  .all('/api/:table/', (ctx, next) => {
    const { table } = ctx.params;
    switch(ctx.method) {
      case 'GET':
        ctx.body = Dao.list(table);
        return;
      case 'POST':
        const data = ctx.request.body;
        ctx.body = Dao.add(table, data);
        return;
    }
  })
  // GET /api/:table/:id 获取数据详情接口
  // PUT /api/:table/:id 更新数据接口
  // DELETE /api/:table/:id 删除数据接口
  .all('/api/:table/:id', (ctx, next) => {
    const { table, id } = ctx.params;
    switch(ctx.method) {
      case 'GET':
        ctx.body = Dao.get(table, Number(id));
        return;
      case 'PUT':
        const data = ctx.request.body;
        ctx.body = Dao.set(table, Number(id), data);
        return;
      case 'DELETE':
        ctx.body = Dao.del(table, Number(id));
        return;
    }
  });
 
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(2333, () => console.log('server started at http://localhost:2333'));
