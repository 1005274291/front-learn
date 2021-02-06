let Vue;
class Store{
    constructor(options={}){
        this._vm=new Vue({
            data:{
                $$state:options.state
            }
        })
        this._mutations=options.mutations||{}
        this._actions=options.actions||{}
        this.getters={}
        // 天王盖地虎
        for(var key in options.getters){
            Object.defineProperty(this.getters,key,{
                get:()=>{
                    return options.getters[key](this.state)
                }
            })
        }
        // 绑定commit，action上下文
        this.commit=this.commit.bind(this)
        this.dispatch=this.dispatch.bind(this)
    }
    get state(){
        return this._vm._data.$$state
    }
    set state(v){
        console.error("please use commit!")
    }

    commit(type,...arg){
        const entry =this._mutations[type]
        if(!entry) {
            console.error("unkonw type!")
            return
        }
        entry(this.state,...arg)

    }
    dispatch(type,...arg){
        const entry=this._actions[type]
        if(! entry){
            console.error("unkonw type!")
            return
        }
        return entry(this,...arg)
    }

}
function install(_Vue){
    Vue=_Vue;
    Vue.mixin({
        beforeCreate(){
            if(this.$options.store){
                // 这是根实例
                Vue.prototype.$store=this.$options.store//Store构造函数的实例
            }
        }
    })
}
export default {Store,install}