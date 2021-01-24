//koa自己封装的req
module.exports={
    get url(){
        return this.req.url
    },
    get method(){
        return this.req.method.toLowerCase()
    }
}