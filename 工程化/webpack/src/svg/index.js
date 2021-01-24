//给webpack加上一个加载素材的代码  
//require方法来自webpack打包的js，context让我们指定一个上下文，是否递归，和文件夹下匹配的文件规则
const req=require.context("./",false,/\.svg$/)//req是一个方法
//keys获取文件名列表
req.keys().map(req)//把每一个文件名赛进req函数中执行一遍，形成了自动加载