const path = require("path");
const {merge}=require("webpack-merge")
const baseConfig =require("./webpack.base.config")
const devConfig = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: "./public", //打包好的路径
    open: true, //是否自动打开浏览器
    port: 8082,
    proxy: {
      "/api": {
        target: "http://localhost:9000/", //把当前端口的所有/api接口的请求全部转发到9000端口
      },
    },
    // hot:true,//开启热更新
    // hotOnly:true
  },
  module: {
    rules: [
      {
        test: /\.less$/, //处理less文件
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag", //将所有的style标签合并成一个
            },
          },
          "css-loader",
          "postcss-loader", //一个css扩展插件，可以修改css代码
          "less-loader", //将less转化成css
        ],
      },
      {
        test: /\.css$/, //匹配规则 处理css文件
        include: path.resolve(__dirname, "./src"), //规定使用这个loader的文件去哪里找
        use: [
          {
            loader: "style-loader",
            options: {
              injectType: "singletonStyleTag", //将所有的style标签合并成一个
            },
          }, //让css样式生效，在html的head标签里面添加style标签，并把css代码填充进去
          "css-loader", //先执行数组后面的，后执行前面的 让webpack识别css可以打包进来
        ],
      },
    ],
  },
};

module.exports=merge(baseConfig,devConfig)
