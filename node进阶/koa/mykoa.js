//原生的http有很多操作实现起来很麻烦，koa解决了两大问题
//1.api优雅话，根据语义调用api 2.AOP支持，可以提供一些切面统一处理一些问题（洋葱圈模型中间件）
const http = require("http")
const context = require("./context")
const request = require("./request")
const response = require("./response")
class KKB {
    constructor() {
        this.middlewares = []
    }
    listen(...args) {
        const server = http.createServer(async (req, res) => {
            //创建上下文
            const ctx = this.createContext(req, res)
            //中间件合成
            const fn = this.compose(this.middlewares)
            await fn(ctx)
            //提交相应
            res.end(ctx.body)
        })
        server.listen(...args)
    }
    use(callback) {
        this.middlewares.push(callback)
    }
    //创建一个ctx
    createContext(req, res) {
        const ctx = Object.create(context)
        ctx.request = Object.create(request)//koa封装
        ctx.response = Object.create(response)//koa封装
        ctx.req = ctx.request.req = req//原生
        ctx.res = ctx.response.res = res//原生
        return ctx
    }
    compose(middlewares) {//输入是中间件数组 返回一个组合函数
        return function (ctx) {
            return dispatch(0)//先从第一个中间件函数开始执行 返回一个Promise
            //将函数的执行结果包装成promise的契约用于解决异步和方便await处理
            function dispatch(i) {
                let fn = middlewares[i]
                if (!fn) {
                    return Promise.resolve()//返回一个执行成功的契约
                }
                return Promise.resolve(fn(ctx, function next() {//给当前中间件传入一个next函数并执行 当调用next时会调用下一个中间件函数 不调用next不会执行下面的函数
                    return dispatch(i + 1)
                }))
            }
        }

    }
}
module.exports = KKB