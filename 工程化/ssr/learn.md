+ 在技术选型上
    + 前端采用nuxt.js的ssr模式，使用的vue2框架
    + 后端采用egg.js
    + 数据库采用mongodb
+ 在工程化上
    + 采用husky进行对git hook的设置对commit进行拦截
    + 采用commitizen进行对git commit注释的规范化
+ 富文本编译器发展史
    1. <\div contenteditable>hha<\/div>
    2. 第三方库 tinyMce，wangEditor
    3. 开源定制库 slate.js
    4. 专门的编译器开发团队，非常复杂，计算位置，样式和实现简易的浏览器工作量差不多
+ scoped是css封装，组件外部使用时只能在不设置scoped的style标签修改组件
+ 导出数据库
    + docker-compose exec mongo mongodump --db kkbhub --out ../dump
+ 导入数据库
    + docker-compose exec mongo mongorestore --db kkbhub ./kkbhub