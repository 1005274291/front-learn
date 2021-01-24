module.exports={
    plugins:[
        require("autoprefixer")({
            //覆盖package和Browserslistrc中的配置
            overrideBrowserslist:["last 2 versions",">1%"]//兼容到市场占有率1%的两个大版本的浏览器
        }),
        require("cssnano")
    ]
}