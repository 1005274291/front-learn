'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  //一个路由对应一个controller
  router.get('/', controller.home.index);
  router.get('/user',controller.user.index)
};
