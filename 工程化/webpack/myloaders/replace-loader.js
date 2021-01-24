module.exports=function(source){
    // return source.replace("hello",this.query.title)
    const msg=source.replace("hello",this.query.title)
    this.callback(null,msg)//第一个参数是err,第二个是内容主体,第三个是sourceMap,第四个是meta
}