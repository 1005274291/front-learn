<template>
  <div>
      <!-- 双向数据绑定，告知校验 -->
      <!-- :value @input -->
      <input :type="type" :value="value" @input="onInput" v-bind="$attrs">
  </div>
</template>

<script>
export default {
    inheritAttrs:false,//防止组件内部的属性（placeholder）继承到根组件
    props:{
        value:{
            type:String,
            default:""
        },
        type:{
            type:String,
            default:"text"
        }

    },
    methods:{
        onInput(e){
            this.$emit("input",e.target.value)
            // 触发校验
            this.$parent.$emit("validate")
        }
    }
}
</script>

<style>

</style>