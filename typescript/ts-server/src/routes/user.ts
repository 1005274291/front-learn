import * as Koa from "koa" 
import {get,post,middlewares,querystring} from "../utils/route-decors"
import model from "../model/user"
const api = {
    findByName(name) {
        return new Promise((resolve, reject):void => {
            setTimeout(() => {
                if (name === 'xia') {
                    reject('用户已存在')
                } else {
                    resolve('用户比对通过')
                }
            }, 500)
        })
    }
}

// @middlewares([
//     async function guard(ctx,next){
//         console.log("guard",ctx.header)
//         if(ctx.header.token){
//             await next()
//         }else{
//             throw "请登录"
//         }
//     }
// ])
export default class User{

    @get("/users",{})//已装饰器的形式自动注册路由，并对应当前中间件
    @querystring({//验证query参数
        age: { type: 'int', required: true, max: 200, convertType: 'int' },
    })
    public async list(ctx:Koa.Context){
        const users=await model.findAll()
        ctx.body={ok:1,data:users}
    }
    
    @post("/users",{
        //采用中间件进行鉴权
        middlewares:[
            async function validation(ctx:Koa.Context,next){
                const name=ctx.request.body.name
                if(!name){
                    throw new Error("请输入用户名")
                }
                //用户名不能重复
                try{
                    await api.findByName(name)
                    //校验通过就继续
                    await next()
                }catch(err){
                    throw err
                }
            }
        ]
    })
    public add(ctx:Koa.Context){
        ctx.body={ok:1}
    }
}