const path = require("path");
const minicss = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const optimizeCss = require("optimize-css-assets-webpack-plugin");
const pruifyCss = require("purifycss-webpack");
const glob = require("glob-all");

const prodConfig = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.less$/, //处理less文件
        use: [
          minicss.loader,
          "css-loader",
          "postcss-loader", //一个css扩展插件，可以修改css代码
          "less-loader", //将less转化成css
        ],
      },
      {
        test: /\.css$/, //匹配规则 处理css文件
        include: path.resolve(__dirname, "./src"), //规定使用这个loader的文件去哪里找
        use: [
          minicss.loader,
          "css-loader", //先执行数组后面的，后执行前面的 让webpack识别css可以打包进来
        ],
      },
    ],
  },
  plugins: [
    new optimizeCss({
      cssProcessor: require("cssnano"), //用什么进行压缩
    }),
    new pruifyCss({
      //需要做tree shaing的文件路径
      paths: glob.sync([
        //利用glob帮我们去匹配文件返回数组
        path.resolve(__dirname, "./src/**/*.js"),
        path.resolve(__dirname, "./src/**/*.html"),
      ]),
    }),
    new minicss({
      //插件将css抽离成独立的文件，以loader的形式加载
      filename: "css/[name]-[contenthash:8].css", //name是入口的chunk名称
    }),
  ],
};

module.exports = merge(baseConfig, prodConfig);
