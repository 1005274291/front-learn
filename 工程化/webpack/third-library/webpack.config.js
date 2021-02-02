const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  //为了环境的需要要导出两个版本的文件（压缩和未压缩）
  entry: {
    "add-number": "./src/index.js",
    "add-number.min": "./src/index.js",
  },
  output: {
    filename: "[name].js", //文件名
    library: "addNumber", //库名
    libraryTarget: "umd", //以什么样的模式导出
    libraryExport: "default", //默认是导出的模块 引入还需要.default 所以我们手动设置导出default
  },
  mode: "none",
  optimization: {
    //在webpack运行时控制压缩
    minimize: true, //开启压缩
    optimization:{
      usedExports:true //哪些导出的模块被使用了，再做打包
    },
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/,
        //加快构建速度
        cache: true, //是否缓存
        parallel: true, //是否开启多线程压缩
        terserOptions: {
          compress: {
            unused: true, //无用代码去掉
            drop_debugger: true, //去掉断点
            drop_console: true, //去掉打印
            dead_code: true, //去掉无用代码
          },
        },
      }),
    ],
  },
};
