module.exports=function(source){
    //定义一个异步处理，告诉webpack,这个loader里有异步事件,在里面调用下这个异步
    const callback=this.async()//这个callback和this.callback一样使用
    setTimeout(()=>{
        const result=source.replace("webpack","webpack!!!!")
        callback(null,result)
    },1000)

}