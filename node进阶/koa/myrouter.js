module.exports=class Router{
    constructor(){
        this.stack=[]
    }
    register(path,methods,middleware){
        let route={path,methods,middleware}
        this.stack.push(route)
    }
    get(path,middleware){
        this.register(path,"get",middleware)
    }
    post(path,middleware){
        this.register(path,"post",middleware)
    }
    routes(){
        let stock =this.stack
        return async function(ctx,next){
            let currentPath =ctx.url;
            let route;

            for(let i=0;i<stock.length;i++){
                let item =stock[i]
                if(currentPath ===item.path && item.methods.indexOf(ctx.method)>=0){
                    //如果路由一样，方法一样就处理完不再往下进行                    
                    route=item.middleware
                    break
                }
            }
            if(typeof route ==="function"){
                console.log("是函数");
                route(ctx,next)//将app实例的ctx和next传给路由配置项处理
                return
            }
            //如果没有找到路由就继续下一个中间件
            await next()
        }
    }
}