class MyVue {
    constructor(options) {
        this.$options = options
        this.$data = options.data
        this.$methods = options.methods
        observe(this.$data)
        proxy(this) //代理自身属性
        if (options.el) {
            this.$mount(options.el)
        }
    }
    $mount(el) {
        //获取宿主
        this.$el = document.querySelector(el)

        // 创建updateComponent
        const updateComponent = () => {
            // 获取渲染函数
            const { render } = this.$options
            const vnode = render.call(this, this.$createElement)//触发收集依赖
            // 将vnode变成dom
            this._update(vnode)

        }
        // 创建跟组件对应的watcher
        new Watcher(this, updateComponent)
    }
    _update(vnode) {
        const preVnode = this._vnode
        if (!preVnode) {
            // init
            this.__patch__(this.$el, vnode)
        } else {
            //update
            this.__patch__(preVnode, vnode)
        }
    }
    __patch__(oldVnode, vnode) {
        if (oldVnode.nodeType) {
            //dom
            const parent = oldVnode.parentElement //获取父节点
            const refElm = oldVnode.nextSibling   //获取参考插入的节点
            const el = this.createEle(vnode)
            parent.insertBefore(el, refElm)
            parent.removeChild(oldVnode)
            // 保存vnode
            this._vnode = vnode
        } else {
            //update
            //获取el
            const el = (vnode.el = oldVnode.el)
            if (oldVnode.tag === vnode.tag) {
                // props
                // 获取新旧props进行比对
                const oldProps = oldVnode.props || {}
                const newProps = vnode.props || {}
                for (const key in newProps) {
                    const oldValue = oldProps[key]
                    const newValue = newProps[key]
                    if (oldValue !== newValue) {
                        el.setAttribute(key, newValue)
                    }
                }
                // 属性删除
                for (const key in oldProps) {
                    if (!(key in newProps)) {
                        el.removeAttribute(key)
                    }
                }
                // children
                const oldCh = oldVnode.children
                const newCh = vnode.children
                if (typeof newCh === "string") {
                    if (typeof oldCh == "string") {
                        // 新老子节点都是文本
                        if (oldCh !== newCh) {
                            el.textContent = newCh
                        }
                    } else {
                        // 新子节点是文本 老子节点不是文本
                        el.innerHTML = ""
                        el.textContent = newCh
                    }
                }
                else if (typeof oldCh === "string") {
                    // 新子节点是数组 老子节点是文本
                    el.innerHTML = ""
                    newCh.forEach(child => {
                        this.createEle(child)
                    })
                } else {
                    //updateChildren
                    this.updateChildren(el, oldCh, newCh)
                }
                this._vnode = vnode
            } else {
                //不是同一个元素
                const oldnode = this.createEle(oldVnode)
                const newnode = this.createEle(vnode)
                const parent = oldnode.parentElement
                const refElm = oldnode.nextSibling
                parent.removeChild(oldnode)
                parent.insertBefore(newnode, refElm)
                this._vnode = vnode
            }
        }

    }
    updateChildren(parentElm, oldCh, newCh) {
        const len = Math.min(oldCh.length, newCh.length)
        for (let i = 0; i < len; i++) {
            this.__patch__(oldCh[i], newCh[i])
        }

        // 批量新增
        if (newCh.length > oldCh.length) {
            // add
            newCh.slice(len).forEach(child => {
                const el = this.createEle(child)
                parentElm.appendChild(el)
            })
        } else if (newCh.length < oldCh.length) {
            // 批量删除 
            oldCh.slice(len).forEach(child => {
                const el = this.createEle(child)
                parentElm.removeChild(el)
            })

        }
    }
    createEle(vnode) {
        const el = document.createElement(vnode.tag)
        //props
        if (vnode.props) {
            for (const key in vnode.props) {
                const value = vnode.props[key]
                el.setAttribute(key, value)
            }
        }
        //children
        if (vnode.children) {
            if (typeof vnode.children == "string") {
                //text
                el.textContent = vnode.children
            } else {
                //递归
                vnode.children.forEach((n) => {
                    const child = this.createEle(n)
                    el.appendChild(child)
                })
            }
        }
        vnode.el = el
        return el
    }

    // h函数 将配置项转换成vnode
    $createElement(tag, props, children) {
        return { tag, props, children }
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
        this.deps = new Set()
    }
    addDep(dep) {
        this.deps.add(dep)
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

class Watcher {
    constructor(vm, updateFn) {
        this.vm = vm
        this.getter = updateFn

        this.get()
    }
    get() {
        // 触发get收集依赖
        Dep.target = this
        this.getter.call(this.vm)
        Dep.target = null
    }
    update() {
        this.get()
    }
}

//先对data中的对象进行defineReactive监听，在执行初始化渲染时会创建一个watcher和更新函数并访问代理到的data，并触发依赖手机添加watcher
//有多少个对象就有多少个observe 有多少key就有多少dep 有多少组件就有多少watcher 
//如果data中的值是数组或对象还会有大dep来处理不被监听到的对象操作和数组操作。$attrs和$listeners也会创建dep来进行响应式处理
//$watch创建一个会创建一个watcher