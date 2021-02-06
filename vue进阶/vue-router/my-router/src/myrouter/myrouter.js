


let Vue; //引入Vue

// 保存选项
class VueRouter {
    constructor(options) {
        this.$options = options
        //缓存path和route映射关系
        this.routeMap = {}
        this.$options.routes.forEach(route => {
            this.routeMap[route.path] = route
        })
        // 定义响应式的属性current  将来this.current的值发生变化 router-view的render函数可以再次执行
        const initial = window.location.hash.slice(1) || "/"
        Vue.util.defineReactive(this,"current",initial)
        // 监听hashchange事件
        window.addEventListener("hashchange",this.onhashchange.bind(this))
    }
    onhashchange(){
        this.current=window.location.hash.slice(1) || "/"
    }
}
VueRouter.install = function (_Vue) {
    Vue = _Vue;
    Vue.mixin({
        beforeCreate() {
            //找到跟组件
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router//router实例
            }
        }
    })
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            }
        },
        render(h) {
            return h(
                "a",
                {
                    attrs: {
                        href: "#" + this.to
                    }
                },
                this.$slots.default
            )
        }
    })
    Vue.component('router-view', {
        render(h) {
            const { routeMap, current } = this.$router
            const component = routeMap[current] ? routeMap[current].component : null;
            return h(component)
        }
    })
}
export default VueRouter