"use strict"

if(process.env.NODE_ENV==="production"){
    module.exports=require("./dist/add-number.min")
}else{
    module.exports=require("./dist/add-number")
}