const path = require("path");
// const webpack=require("webpack")
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const minicss = require("mini-css-extract-plugin");
const Txt = require("./myPlugins/txt-webpack-plugin");
// console.log(process.env)
module.exports = {
  // webpack执行构建入口
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
  mode: "development", //在什么环境下打包
  resolveLoader: {
    //告诉webpack loader去哪里找
    modules: ["./node_modules", "./myloaders"],
  },
  devtool: "cheap-module-eval-source-map",
  resolve: {
    alias: {
      //配置别名
      css: path.join(__dirname, "src/css"),
    },
    modules: [path.resolve(__dirname, "./node_modules")], //规定webpack去哪找第三方模块
    // extensions: [".jsx", ".js", "json","css","less"] //可以不用写后缀名 优化开发体验，提升打包时间
  },
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
    //对所有模块的处理
    rules: [
      //匹配规则的组合
      // {
      //   test: /\.js$/,
      // use: [//自定义loader
      //     {
      //       loader: "replace-loader",
      //       options: {
      //         title: "welcome",
      //       },
      //     },
      //     {
      //       loader: "replace-asyncloader",
      //     },
      //   ],
      // },
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
        test: /\.css$/, //匹配规则 处理css文件
        include: path.resolve(__dirname, "./src"), //规定使用这个loader的文件去哪里找
        use: [
          // {
          //   loader:"style-loader",
          //   options:{
          //     injectType:"singletonStyleTag" //将所有的style标签合并成一个
          //   }
          // }, //让css样式生效，在html的head标签里面添加style标签，并把css代码填充进去
          minicss.loader,
          "css-loader", //先执行数组后面的，后执行前面的 让webpack识别css可以打包进来
        ],
      },
      {
        test: /\.less$/, //处理less文件
        use: [
          // {
          //   loader:"style-loader",
          //   options:{
          //     injectType:"singletonStyleTag" //将所有的style标签合并成一个
          //   }
          // },
          minicss.loader,
          "css-loader",
          "postcss-loader", //一个css扩展插件，可以修改css代码
          "less-loader", //将less转化成css
        ],
      },
      // {
      //   test:/\.less$/,
      //   use:[
      //     "kkb-style-loader","kkb-css-loader","kkb-less-loader"
      //   ]
      // },
      {
        test: /\.scss$/, //处理sass文件
        use: [
          "style-loader",
          "css-loader",
          "sass-loader", //将less转化成css
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
    new minicss({
      //插件将css抽离成独立的文件，以loader的形式加载
      filename: "css/[name]-[contenthash:8].css", //name是入口的chunk名称
    }),
    new Txt(),
    // new webpack.HotModuleReplacementPlugin() 热更新不能使用chunkhash和contenthash
  ],
};
