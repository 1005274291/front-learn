//增加异常统一处理中间件，异常统一处理，
//开发环境返回详细的异常信息，生产环境不返回详细信息

module.exports=(option,app)=>{
    return async function (ctx,next){
        try{
            await next()
        }catch(err){
            //所有异常都在app上触发一个error事件，框架会记录一条错误日志
            app.emit("error",err,this)
            const status=err.status||500//获取错误信息的状态码
            const error=status===500&&app.config.env==="prod"?
            "internal server Error":err.message
            //从error对象上读出各个属性，设置到响应中
            ctx.body={
                code:status,// 服务端⾃身的处理逻辑错误(包含框架错误500 及⾃定义业务逻辑错误533开始 ) 客户端请求参数导致的错误(4xx开始)，设置不同的状态码
                error:error
            }
            if(status ===422){//用户自定义错误，返回错误信息
                ctx.body.detail=err.errors
            }
            ctx.status=200
        }
    }
}