//为了访问app中的controller等，需要接收app
module.exports = app=>({
  "get /": app.$ctrl.home.index//访问controller
  ,
  "get /detail": app.$ctrl.home.detail
});
//index没有前缀，而当前目录的其他js文件配置的是前缀的子路由