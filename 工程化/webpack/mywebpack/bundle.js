//模拟 npx webpack命令
const webpack =require("./mywebpack")

const options=require("./webpack.config")
new webpack(options).run()