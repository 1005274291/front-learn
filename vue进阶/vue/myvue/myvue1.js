class MyVue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.$methods = options.methods
        observe(this.$data)
        proxy(this) //代理自身属性
        new Compile(options.el, this) //解析模板
    }
}
// 观察整个对象 
function observe(obj) {
    if (typeof obj !== 'object' || obj == null) {
        return
    }
    new Observer(obj)
}
class Observer {
    constructor(obj) {
        this.obj = obj
        if (Array.isArray(obj)) {
            // 处理数组的响应式
        } else {
            this.walk(obj)
        }
    }
    // 便利对象的每个属性使之成为响应式
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
        })
    }
}
// 响应式 
function defineReactive(obj, key, value) {
    observe(value) //递归遍历使对象响应式
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        get() {
            Dep.target && dep.addDep(Dep.target) //在模板编译时收集依赖 将watcher填入deps中存储起来
            return value
        },
        set(newval) {
            if (newval == value) return
            value = newval
            dep.notify() //触发更新
        }
    })
}
// 存储对于key的依赖
class Dep {
    constructor() {
        this.deps = []
    }
    addDep(dep) {
        this.deps.push(dep)
    }
    notify() {
        this.deps.forEach(dep => dep.update())
    }
}
function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(newval) {
                vm.$data[key] = newval
            }
        })
    })
}

class Compile {
    constructor(el, vm) {
        this.$vm = vm
        this.$el = document.querySelector(el)
        if (this.$el) {
            this.compile(this.$el)
        }
    }
    // 解析模板
    compile(el) {
        const childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                // 编译元素节点
                this.compileElement(node)
            } else if (this.isInterpolation(node)) {
                // 插值文本
                this.compileText(node)
            } else {
                // 普通文本不需要解析
            }
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node) //如果元素有子元素递归解析子元素
            }
        })
    }
    isElement(node) {
        return node.nodeType == 1;
    }
    isInterpolation(node) {
        return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }
    // 初始化和更新都会调用 接受node节点，属性，指令
    update(node, exp, dir) {
        const fn = this[dir + "Updater"]//定义具体指令的更新函数
        fn && fn(node, this.$vm[exp])
        new Watcher(this.$vm, exp, function (val) {
            //通过传入回调函数更新模板当中的值
            fn && fn(node, val)
        })//创建对应的watcher观察 并通过watcher触发收集依赖使之变成响应式
    }
    compileText(node) {
        this.update(node, RegExp.$1, 'text')
    }
    text(node, exp) {
        this.update(node, exp, 'text')
    }
    html(node, exp) {
        this.update(node, exp, "html")
    }
    model(node, exp) {
        this.update(node, exp, "model")
    }
    textUpdater(node, value) {
        node.textContent = value
    }
    htmlUpdater(node, value) {
        node.innerHTML = value
    }
    modelUpdater(node, value) {
        node.value = value
    }
    compileElement(node) {
        let nodeAttrs = node.attributes
        Array.from(nodeAttrs).forEach(attr => {
            let attrName = attr.name
            let exp = attr.value
            if (this.isDirective(attrName)) {
                //vue中的特殊指令
                let dir = attrName.substring(2)
                this[dir] && this[dir](node, exp)
            } else if (this.isEvent(attrName)) {
                //vue中的事件
                let dir = attrName.substring(1)
                let param = this.decodeParam(exp)
                exp = exp.split("(")[0]
                this[dir] && this[dir](node, exp, param)
            }
        })
    }
    decodeParam(exp) {
        let str = exp.substring(exp.indexOf("(") + 1, exp.indexOf(")"))
        if (!str) {
            return ""
        }
        return str.split(",")
    }
    click(node, exp, param) {
        this.handle(node, exp, "click", param)
    }
    input(node, exp, param) {
        this.handle(node, exp, "input", param)
    }
    handle(node, exp, dir, param) {
        let fn = this.$vm.$methods[exp]
        // 绑定vue实例的作用域 冬瓜冬瓜我是西瓜
        fn = fn.bind(this.$vm)
        fn && this.functionaddEventHandler(node, dir, fn, param)
    }
    functionaddEventHandler(obj, eventName, fun, param = []) {

        var fn = fun;
        if (param && param.length > 0) {
            fn = function (e) {
                fun.apply(this, param);  //继承监听函数,并传入参数以初始化;
            }
        }
        if (obj.addEventListener) {
            obj.addEventListener(eventName, fn, false);
        }
    }
    isDirective(attr) {
        return attr.indexOf("k-") == 0
    }
    isEvent(attr) {
        return attr.indexOf("@") == 0
    }
}
class Watcher {
    constructor(vm, key, updateFn) {
        this.vm = vm
        this.key = key
        this.updateFn = updateFn
        Dep.target = this
        this.vm[this.key]//强制读取属性 触发defineReactive中的get收集依赖
        Dep.target = null
    }
    update() {
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}


//一个组件的data一个Observe defineReactive代理data中的所有key 一个key对应一个dep 一个dep管理很多watcher 一个watcher对应一个元素
//如果代理的值还是对象会递归的Observe