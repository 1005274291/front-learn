const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

//加载对应文件夹下的模型，和装载完成的回调函数
function load(dir, cb) {
  const url = path.resolve(__dirname, dir); //转换成绝对路径
  const files = fs.readdirSync(url); //读取模块目录下的文件列表
  files.forEach((filename) => {
    filename = filename.replace(".js", ""); //把去掉扩展名的字符串作为模块名
    const file = require(url + "/" + filename); //加载文件
    cb(filename, file);
  });
}

//将模型创建成功以后绑定在app实例上
const loadModel = (config) => (app) => {
  //先接收配置后接收实例
  mongoose.connect(config.db.url, config.db.options);
  const conn = mongoose.connection;
  conn.on("error", () => {
    console.error("数据库连接失败");
  });
  // conn.once("open",async()=>{
  console.log("建立数据库连接成功");
  app.$model = {}; //将加载的模型都挂载到app上
  load("../model", (filename, { schema }) => {
    //将模块名和模块的模型都拿到
    console.log("模块加载", filename, schema);
    app.$model[filename] = mongoose.model(filename, schema); //注册模型，并且在数据库中按模型建表
  });
  // })
};
module.exports = {
  loadModel,
};
