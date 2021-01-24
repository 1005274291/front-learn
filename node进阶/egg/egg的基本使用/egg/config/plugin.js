'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  sequelize: {//注册插件，和插件对应的包
    enable: true,
    package: 'egg-sequelize',
  }
};
