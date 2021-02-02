const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: "./src/index/index.js",
  },
  // 构建完成的出口
  output: {
    // 输出的文件名
    filename: "js/[name]-[chunkhash:8].js", //占位符代表入口的key
    // 输出的文件存放的路径，必须是绝对路径
    path: path.resolve(__dirname, "./public"),
  },
  module: {
    //对所有模块的处理
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, //排除库中的js文件
        use: [
          {
            loader: "thread-loader", //开启多线程构建 将loader放置在worker池里运行
          },
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/, //处理图片
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            // publicPath:"./",//在引用图片时加上相对路径
            outputPath: "images/", //输出到哪个目录下
            limit: 204800, //小于2048字节 采用base64(不发起http请求适合小图片,打包到js里)
          },
        },
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/, //处理字体
        exclude: [path.resolve(__dirname, "./src/svg")], //规定loader排除掉哪里的文件
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            publicPath: "../",
          },
        },
      },
      {
        test: /\.svg$/,
        use: {
          loader: "svg-sprite-loader",
          options: {
            symbolId: "icon-[name]", //引用图标的时候用#icon-egg
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), //清除以前的出口文件，保证每次出口目录都是最新的代码，使得开发显得纯粹
    new htmlWebpackPlugin({
      //html模板用于自动引入打包好的内容
      title: "my app",
      filename: "index.html",
      template: "./src/index/index.html",
    }),
    
  ],
};
