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
    const {info,register,login,verify,updateInfo,
      isfollow,
      follow, cancelFollow,
      following, followers,
      articleStatus,
      likeArticle, cancelLikeArticle,}=controller.user
    router.post("/register",register)
    router.post("/login",login)
    router.get("/info",jwt,info)
    router.put('/info', jwt, updateInfo)
    router.get("/detail",jwt,info)
    router.get("/verify",verify)

    router.get('/follow/:id', jwt, isfollow)

    router.put('/follow/:id', jwt, follow)
    router.delete('/follow/:id', jwt, cancelFollow)

    router.get('/:id/following', following)
    router.get('/:id/followers', followers)

    router.get('/article/:id', jwt, articleStatus)

    // // .put点赞，。delete取消点赞
    router.put('/likeArticle/:id', jwt, likeArticle)
    router.delete('/likeArticle/:id', jwt, cancelLikeArticle)
  })
  router.group({ name: 'article', prefix: '/article' }, router => {
    const { create, detail, index } = controller.article
    router.post('/create', jwt, create)
    router.get('/:id', detail)
    router.get('/', index)
  })
}
