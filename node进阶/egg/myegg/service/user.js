//service层主要是抽离逻辑，需要处理异步函数
const delay = (data, tick) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, tick);
  });
// 可复⽤的服务 ⼀个同步，⼀个异步
// 为了调用db需要接收app参数
module.exports = app=>({
  getName() {
    // return delay("jerry", 1000);
    return app.$model.user.findAll()
  },
  getAge() {
    return 20;
  },
});
