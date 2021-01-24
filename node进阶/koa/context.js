//koa自己封装的上下文，包含了request和response
module.exports={
    get url(){
        return this.request.url
    },
    get body(){
        return this.response.body
    },
    set body(val){
        this.response.body=val
    },
    get method(){
        return this.request.method
    }
}