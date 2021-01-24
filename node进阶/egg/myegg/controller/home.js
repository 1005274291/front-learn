module.exports = app=>({
  index: async (ctx) => {
    app.ctx.body = "⾸⻚";
  },
  detail: (ctx) => {
    app.ctx.body = "详情⻚⾯";
  },
});
//为了在controller中能访问到app所以进行柯里化高阶函数