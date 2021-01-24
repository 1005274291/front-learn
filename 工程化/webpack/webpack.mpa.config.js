
//多入口打包模式
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const minicss = require("mini-css-extract-plugin");
const glob=require("glob")//读取文件路径的工具
const setMPA=()=>{
  const entry={}
  const htmlWebpackPlugins=[]

  const enrtyFiles=glob.sync(path.join(__dirname,"./src/*/index.js")) //glob会帮我们把匹配这个格式的的文件名都找出来
  enrtyFiles.map((item,index)=>{
    const entryFile =enrtyFiles[index]//该入口的js路径
    const match =entryFile.match(/src\/(.*)\/index\.js$/)
    const pageName=match[1]//获取入口名称
    entry[pageName]=entryFile
    htmlWebpackPlugins.push(new htmlWebpackPlugin({
      template:path.join(__dirname,`./src/${pageName}/index.html`),
      filename:`${pageName}.html`,
      chunks:[pageName]//这个模板引入哪个chunk中的文件
    }))
  })

  return {
    entry,
    htmlWebpackPlugins
  }
}
const {entry,htmlWebpackPlugins} =setMPA()
module.exports = {
  // webpack执行构建入口
  entry,
  // 构建完成的出口
  output: {
    // 输出的文件名
    filename: "js/[name]-[chunkhash:8].js", //占位符代表入口的key
    // 输出的文件存放的路径，必须是绝对路径
    path: path.resolve(__dirname, "./public"),
  },
  mode: "development", //在什么环境下打包
  devtool:"cheap-module-eval-source-map",
  module: {
    //对所有模块的处理
    rules: [
      {
        test: /\.css$/, //匹配规则 处理css文件
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
        test: /\.(eot|ttf|woff|woff2|svg)$/,//处理字体
        use:{
          loader:"url-loader",
          options:{
            name:"[name].[ext]",
            publicPath:"../"
          }
        }
      }
    ],
  },
  plugins: [
    ...htmlWebpackPlugins,
    new CleanWebpackPlugin(), //清除以前的出口文件，保证每次出口目录都是最新的代码，使得开发显得纯粹
    new minicss({
      //插件将css抽离成独立的文件，以loader的形式加载
      filename: "css/[name]-[contenthash:8].css", //name是入口的chunk名称
    }),
  ],
};
