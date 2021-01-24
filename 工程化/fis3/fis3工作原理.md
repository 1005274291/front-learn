# fis3工作原理
1. 扫描项目目录拿到文件并初始化出一个文件对象列表
2. 对文件对象中的每一个文件进行单文件编译
    + 单文件编译过程中通过读取文件属性来执行扩展点插件
    + lint:代码校验检查，需要release命令行加-l
    + parser:预处理阶段，比如less，sass编译为标准css，前端模板编译成js
    + preprocessor:标准化前处理插件(image-set可自动添加-webkit-image-set的css 规则)
    + standard: 标准化插件，自定义uri，embed，require等三种能力
    + postprocessor: 标准化后处理插件（require-async）
    + optimizer:压缩文件
3. 获取用户设置的package插件，进行打包处理（包括合并图片）
    + prepackage 打包前处理插件扩展点（plugin-name）
    + packager 打包插件扩展点，通过此插件收集文件依赖信息，合并信息产出静态资源映射表
    + spriter 图片合并扩展点，如csssprites
    + postpackager 打包后处理扩展插件点


## fis内置核心功能
1. 资源定位 （将相对路径转化为绝对路径，无论部署到哪）__uri(js) url(css)
2. 内容嵌入 __inline
3. 依赖声明 useMap:true 输出到带有__RESOURCE_MAP__的文件中