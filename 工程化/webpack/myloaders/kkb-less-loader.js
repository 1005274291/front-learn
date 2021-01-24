//把less语法转换成css语法

const less =require("less")


module.exports=function(source){
    less.render(source,(err,output)=>{
        this.callback(err,output.css)
    })
}