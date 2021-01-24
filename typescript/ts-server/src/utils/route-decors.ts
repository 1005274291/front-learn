import * as glob from "glob";
import * as Koa from "koa";
import * as KoaRouter from "koa-router";
import * as  Parameter from 'parameter';
type HTTPMethod = "get" | "put" | "delete" | "post"; //解决请求方法公用逻辑可以使用柯里化
type RouterOptions = {
  //用于特殊的配置
  //单独定制前缀
  prefix?: string;
  //给当前路由特定的中间件数组
  middlewares?: Array<Koa.Middleware>;
};
type LoadOptions = {
  //路由文件扩展名，默认是.{js,ts}
  extname?: string;
};
const router = new KoaRouter();
//router 是作用域变量，所以尽量让通用方法为纯函数所以需要再次柯里化
const createMethod = (router: KoaRouter) => (method: HTTPMethod) => (
  path: string,
  options?: RouterOptions
) => {
  return (target, property) => {
    //由于装饰器的执行顺序是方法装饰器先与类装饰器，如果想调换顺序需要加入到微任务延迟执行
    process.nextTick(() => {
      const url = options && options.prefix ? options.prefix + path : path;
      const middlewares=[]
      //如果类中已经存在中间件先加载类的中间件再加载方法中间件，最后加载对应中间件
      if(target.middlewares){
          middlewares.push(...target.middlewares)
      }
      if(options.middlewares){
          middlewares.push(...options.middlewares)
      }
      middlewares.push(target[property])
      router[method](url, ...middlewares);
    });
  };
};
const method = createMethod(router);
export const get = method("get");
export const post = method("post");
//为了自动加载routes下面注册的路由需要一个loader
export const load = (folder: string, options: LoadOptions) => {
  const extname = options.extname || ".{js,ts}";
  glob
    .sync(require("path").join(folder, `./**/*${extname}`))
    .forEach((item) => {
      require(item);
    });
  return router;
};

export const middlewares=(middlewares:Koa.Middleware[])=>{
    return function(target){
        //将中间件挂到类的prototype上，这样实例属性可以访问
        target.prototype.middlewares=middlewares
    }
}

const validateRule = paramPart => rule => {
    return function (target, name, descriptor) {
        const oldValue = descriptor.value//获取中间件函数
        descriptor.value = function () {
            const ctx = arguments[0]
            const p = new Parameter()
            const data = ctx[paramPart]
            const errors = p.validate(rule, data)//验证
            console.log('error',errors)
            if (errors) throw new Error(JSON.stringify(errors))
            return oldValue.apply(null, arguments);//验证通过执行中间件
        }
        return descriptor;
    }
}

export const querystring = validateRule('query')
export const body = validateRule('body')
