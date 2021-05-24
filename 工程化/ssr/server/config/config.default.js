/* eslint valid-jsdoc: "off" */

'use strict'

const path =require("path")

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}
  config.cluster={
    listen:{
      path:"",
      port:8080,
      hostname:"0.0.0.0"
    }
  }
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1620618594104_4348'

  // add your middleware config here
  config.middleware = []
  config.multipart={
    mode:'file',
    whitelist:()=>true
  }
  config.UPLOAD_Dir=path.resolve(__dirname,"..","app/public")
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
    security:{
      csrf:{
        enable:false
      }
    },
    mongoose:{
      client:{
        url:'mongodb://127.0.0.1:27017/kkbhub',
        options:{}
      }
    },
    jwt:{
      secret:'junbao666!!!!'
    }
  }
}
