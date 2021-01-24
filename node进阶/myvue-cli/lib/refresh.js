const fs=require("fs")
const handlebars =require("handlebars")//拼接代码|后端渲染
const chalk =require("chalk")


module.exports=async()=>{
    //获取列表
    const list =fs.readdirSync("./src/views")//获取文件名
    .filter(v=>v!="Home.vue")//筛选不需要配置的文件
    .map(v=>({
        name:v.replace(".vue","").toLowerCase(),//name是path不需要带扩展名
        file:v
    }))
    compile({list},`./src/router.js`,"./template/router.js.hbs")
    compile({list},"./src/App.vue","./template/App.vue.hbs")

    function compile(meta,filePath,templatePath){
        //1.数据（list数组）2.输出文件3.模板文件
        if(fs.existsSync(templatePath)){
            //判断在这个模板文件中是否存在模板
            const content =fs.readFileSync(templatePath).toString()//读取模板
            const result=handlebars.compile(content)(meta)//用模板制作渲染函数，在将数据传进渲染函数
            fs.writeFileSync(filePath,result)//将得到的结果写入文件（会覆盖原有文件的内容）
            console.log(chalk.red(`${filePath}文件创建成功`))
        }
    }
}

