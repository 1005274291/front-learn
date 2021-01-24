/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1608019320253_7094';

  // add your middleware config here
  config.middleware = ['errorHandler'];
  config.swaggerdoc={
    dirScanner:"./app/controller",//扫描哪个来生成文档
    appInfo:{//文档标题
      title:'开课吧接口',
      description: '开课吧接⼝ swagger-ui for egg',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    enableSecurity: false,
    routerMap: true,//开启路由匹配根据@router自动注册路由
    enable:true
  }
  config.mongoose = {
    url: 'mongodb://127.0.0.1:27017/egg_x',//用mongodb中的egg_x数据库
    options: {
      // useMongoClient: true,
      autoReconnect: true,
      reconnectTries: Number.MAX_VALUE,
      bufferMaxEntries: 0,
    },
  }
  config.jwt = {
    secret: 'Great4-M',
    enable: true, // default is false
    match: /^\/api/, // optional 对所有调用api接口的进行鉴权
  }
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
