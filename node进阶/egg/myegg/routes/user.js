module.exports = {
  "get /": async (app) => {
    //通过app调用service层
    const name=await app.$service.user.getName()
    app.ctx.body = "⽤户:"+name[0].dataValues.name;
  },
  "get /info": (app) => {
    app.ctx.body = "⽤户年龄："+app.$service.user.getAge();
  },
};
