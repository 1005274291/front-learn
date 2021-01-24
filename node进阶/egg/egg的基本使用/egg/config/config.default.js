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
  config.keys = appInfo.name + '_1566527611063_9390';//用于签名

  // add your middleware config here
  config.middleware = [];//添加中间件

  // add your user config here
  const userConfig = {//项目配置
    myAppName: 'egg',
    sequelize: {//数据库配置
      dialect: "mysql",
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "123456",
      database: "开课吧"
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
