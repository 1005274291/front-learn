(function(modules){
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
            require("./src/index.js")//相当于require("./src/index.js") 从入口模块开始执行
        })({"./src/index.js":{"dep":{"./a.js":"./src\\a.js"},"code":"\"use strict\";\n\nvar _a = require(\"./a.js\");\n\ndocument.writeln(\"这是indexjs\" + _a.a);"},"./src\\a.js":{"dep":{"./b.js":"./src\\b.js"},"code":"\"use strict\";\n\nvar _b = require(\"./b.js\");\n\nvar str = \"我是a模块\" + _b.b;\nexports.a = str;"},"./src\\b.js":{"dep":{},"code":"\"use strict\";\n\nvar str = \"我是b模块\";\nexports.b = str;"}});//传入的是依赖图谱
        