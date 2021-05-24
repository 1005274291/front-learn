'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  const jwt=app.middleware.jwt({app})
  router.get('/', controller.home.index)
  router.get("/captcha",controller.utils.captcha)
  router.get("/sendcode",controller.utils.sendcode)
  router.post("/uploadfile",controller.utils.uploadfile)
  router.post("/mergefile",controller.utils.mergefile)
  router.post('/checkfile',controller.utils.checkfile)
  //使用egg-router-group插件进行分组路由
  router.group({name:'user',prefix:'/user'},(router)=>{
    const {info,register,login,verify}=controller.user
    router.post("/register",register)
    router.post("/login",login)
    router.get("/info",jwt,info)
    router.get("/verify",verify)
  })
}
