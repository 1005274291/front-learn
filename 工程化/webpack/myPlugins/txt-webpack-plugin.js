//自定义插件的结构


module.exports=class Txtwebpackplugin{
    //apply这个方法用来注册插件
    apply(compiler){//webpack接收完配置文件的实例
        //勾入异步hook
        compiler.hooks.emit.tapAsync("Txtwebpackplugin",(compilation,cb)=>{
            //compilation是源代码加工到这一步的样子
            compilation.assets["kkb.txt"]={
                //assets是要输出的文件列表 key是文件名 value是对象 包含source函数和size函数
                source:function(){
                    return "hello txt"
                },
                size:function(){
                    return 1024//不一定是真正文件的体积，而是给打包后的终端面板显示的
                }
            }
            cb()//通过回调函数告诉webpack插件结束
        })
        //勾入同步hook
        compiler.hooks.compile.tap("Txtwebpackplugin",(compilation)=>{
            // console.log(compiler.hooks)
        })
    }
}