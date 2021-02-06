// 传入一个组件配置
// 将它实例化，挂载至body
import Vue from "vue"
export function create(Component,props){
    // 实例化1.extend 2.new Vue({render(){}})
    const vm=new Vue({
        render:(h)=>{
            return h(Component,{props})
        }
    })
    // 挂载才能获得dom
    vm.$mount()// 不传递宿主，手动追加避免覆盖原有内容
    document.body.appendChild(vm.$el)
    // 获取挂载组件实例
    const comp =vm.$children[0]
    comp.remove=()=>{
        document.body.removeChild(vm.$el)
        vm.$destroy() //销毁组件实例
    }
    return comp
}