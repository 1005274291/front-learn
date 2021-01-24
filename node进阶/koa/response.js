//koa自己封装的res
module.exports={
    get body(){
        return this._body;
    },
    set body(val){
        this._body=val
    }
}