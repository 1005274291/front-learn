//读取webpack的配置选项，生成compiler实例，调用compiler.run() 开始执行打包
//读取到配置的入口，从入口文件开始打包
//模块分析-》模块的依赖（依赖的路径）-》可以用递归的方式处理依赖
//内容处理
//依赖图谱对象
//webpackBootstrap函数
//读取到配置的出口-》生成文件-》文件存放的位置-》文件的名称
const fs=require('fs')
//用于将文件分析成ast树结构，单位是节点，利于我们分辨什么语句是模块化语句从而分析依赖
const parser=require("@babel/parser");
//可以对我们得到得ast树节点进行增删改查和筛选
const traverse =require("@babel/traverse").default
const path=require("path")
const {transformFromAst} =require("@babel/core")
module.exports=class webpack{
    constructor(options){
        const {entry,output} =options
        //保存入口和出口路径
        this.entry=entry;
        this.output=output;
        this.modules=[]//存储所有得模块
    }
    run(){
        //从入口文件开始解析文件
        const info= this.parse(this.entry)
        this.modules.push(info)//将解析好的入口模块存储起来
        //遍历入口模块中得依赖模块，递归得解析依赖模块
        for(let i=0;i<this.modules.length;i++){
            const item=this.modules[i]
            if(item.dep){
                for(let j in item.dep){
                    //获取依赖相对项目得路径 递归得遍历他们
                    this.modules.push(this.parse(item.dep[j]))
                }
            }
        }
        //将数组结构转换成对象
        const obj={}
        this.modules.forEach(item=>{
            obj[item.entryFile]={
                dep:item.dep,
                code:item.code
            }
        })
        this.file(obj)
    }
    parse(entryFile){//参数为模块相对于项目路径
        //读取文件内容
        const content =fs.readFileSync(entryFile,"utf-8")
        //分析依赖，以及依赖的路径 
        const ast=parser.parse(content,{
            sourceType:"module"//以模块的形式解析它
        })
        //可以将文件识别为程序时会将信息存储在ast.program.body中
        //筛选出import节点
        const dirname=path.dirname(entryFile)//获取入口文件得目录好计算依赖得相对路径
        //存储依赖，key是相对入口文件得路径，value是相对项目得路径
        const dep={}
        traverse(ast,{
            ImportDeclaration({node}){
                //筛选出的import节点
                const newPathName="./"+path.join(dirname,node.source.value)
                dep[node.source.value]=newPathName
            }
        })
        //处理内容 利用babel可以将ast代码转化为js代码
        const {code}= transformFromAst(ast,null,{
            presets:["@babel/preset-env"]//将ast转换成什么样得js
        })
        return {
            entryFile,//文件相对于项目路径
            dep,//文件依赖
            code//文件代码
        }
    }
    file(obj){
        const filePath=path.join(this.output.path,this.output.filename)

        //接收依赖图谱，生成bundle文件内容
        const newcode=JSON.stringify(obj)
        //require的执行结果就是返回exports对象
        const bundle=`(function(modules){
            function require(module){
                function pathRequire(relativePath){
                    //relativePath:./a.js->./src/a.js
                    return require(modules[module].dep[relativePath])
                }
                const exports={};
                (function(require,exports,code){//code中的require引用的是相对路径，我们需要处理成相对项目的路径进行引用
                    eval(code)
                })(pathRequire,exports,modules[module].code)
                return exports;
            }
            require("${this.entry}")//相当于require("./src/index.js") 从入口模块开始执行
        })(${newcode});//传入的是依赖图谱
        `
        //生成文件，放入输出目录
        fs.writeFileSync(filePath,bundle,"utf-8")
    }
}