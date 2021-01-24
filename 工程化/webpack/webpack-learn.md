+ 全局执行webpack是在全局变量里面去找webpack,webpack是基于node写的
+ npx webpack和npm run webpack 是从node_modules中的bin里面去找
+ webpack默认支持js和json模块
+ 支持CommonJS ESmoudule AMD等模块类型，并且webpack做了模块化的兼容
+ mode来指定当前的构建环境 production（生产 不显示所属代码块） development（开发,显示文件名和所属代码块） none
+ loader 由于webpack原生支持的文件类型有限，我们需要把模块原内容转换成新内容（把默认不支持的格式，告诉webpack怎么去处理让他支持）
+ plugins webpack的扩展补充 webpack在打包过程中是有生命周期的钩子的，plugin可以在webpack运行到某个阶段的时候，去做一些额外的事情
+ chunk 代码块 一般是从一个入口开始，找个入口所有的依赖模块，这些模块属于一个代码块
+ 处理css可以使用postcss，这个平台下面有很多的插件，都是以js的方式实现的，可以为css添加前缀来兼容浏览器，也可以进行css代码压缩等
+ mini-css-extract-plugin 是可以把css处理成单独文件形式的插件
+ base64 可以不需要发起请求的直接打包进js或者css中 格式为"data:image/jpeg;base64,-----"
+ 自定义loader实际上就是一个函数 不可以是箭头函数(因为有this是构造函数) 需要返回一个str或buffer
+ devServer可以自动的打开浏览器把打包好的目录放服务器上面，而打包后的模块不会放在输出目录而是放在内存中，从而提升速度
+ webpack的hash策略，有hash和chunkhash contenthash
  + hash策略是以项目为单位的，项目内容改变，则会生成新的hash，内容不变则hash不变
  + chunkhash是以chunk为单位，这个chunk相关联的内容改变则整个chunk组的hash值都会改变，如果chunk内容没有改变则hash值不会改变
  + content是以文件内容为单位，这个文件的内容改变则会改变hash值，如果文件的内容没有改变，则hash值不会改变   
+ babel是用来将高级语法转换成低级语法，让以前的浏览器可以兼容的工具，而babel-loader是webpack与babel的通信桥梁不会做语法转换，而具体的转换需要对应的预设来做
+ 而垫片polyfill是包含所有es6的新特性，如果用户使用的浏览器很旧没有这些新特性，我们可以动态的给用户添加
+ 自定义插件就是webpack运行到某一个生命周期时需要额外做一些事情,通过实例化插件并调用实例的apply方法来勾入插件