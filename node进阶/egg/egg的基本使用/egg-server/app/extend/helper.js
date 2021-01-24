//helper⽅法实现统⼀响应格式Helper 函数⽤来提供⼀些实⽤的 utility 函数。它的作⽤在于我们可以将⼀些常⽤的动作抽离在 helper.js ⾥⾯成为⼀个独⽴的函数，这样可以⽤JavaScript 来写复杂的逻辑，避免逻辑分散各处。另外还有⼀个好处是 Helper 这样⼀个简单的函数，可以让我们更容易编写测试⽤例。框架内置了⼀些常⽤的 Helper 函数。我们也可以编写⾃定义的 Helper 函数。
//已纯函数的方式实现一些通用函数

const moment=require("moment")

//格式化时间
exports.formatTime=time=>moment(time).format("YYYY-MM-DD HH:mm:ss")


//处理成功响应
exports.success=({ctx,res=null,msg="请求成功"})=>{
    ctx.body={
        code:0,
        data:res,
        msg
    }
    ctx.status=200
}