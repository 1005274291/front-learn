<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
    //方便把参数传下去
    provide(){
        return{
            form:this //传递响应式数据
        }
    },
    props:{
        model:{
            type:Object,
            required:true
        },
        rules:{
            type:Object
        }
    },
    methods:{
        validate(cb){
            // 调用所有item里面的validate
            const tasks=this.$children.filter(item=>item.prop)
            .map(item=>item.validate())// 返回是数组每一项是一个promise
            // 判断tasks是否全部通过
            Promise.all(tasks).then(()=>cb(true)).catch(()=>cb(false))
        }
    }
}
</script>

<style>
</style>