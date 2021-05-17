// 解析token中的信息中间件也可以使用egg-jwt，，自己封装的更灵活
const jwt=require("jsonwebtoken")
module.exports=({app})=>{
    return async function verify(ctx,next){
        if(!ctx.request.header.authorization){
            //没有token
            ctx.body={
                code:-666,
                message:'用户没有登录'
            }
            return
        }
        const token=ctx.request.header.authorization.replace("Bearer ","")
        try{
            const ret =await jwt.verify(token,app.config.jwt.secret)
            console.log("解析好的token",ret)
            //ctx.state 保存的是全局变量
            ctx.state.email =ret.email
            ctx.state.userid=ret._id
            await next()
        }catch(e){
            if(e.name=="TokenExpriedError"){
                ctx.body={
                    code:-666,
                    message:"登录过期了"
                }
            }else{
                ctx.body={
                    code:-666,
                    message:'用户信息出错'
                }
            }
        }
    }
}