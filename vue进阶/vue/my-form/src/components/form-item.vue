<template>
  <div>
    <!-- label -->
    <label v-if="label">{{ label }}</label>
    <!-- 内容 -->
    <slot></slot>
    <!-- 校验和错误信息展示 -->
    <small v-if="error">{{ error }}</small>
  </div>
</template>

<script>
import Validator from "async-validator"
export default {
  inject: ["form"],
  props: {
    label: {
      type: String,
      default: "",
    },
    prop: {
      type: String,
    },
  },
  data() {
    return {
      error: "",
    };
  },
  mounted() {
    this.$on("validate", () => {
      this.validate();
    });
  },
  methods: {
    validate() {
      console.log("校验触发");
      // 1.获取数据和校验规则
      const rules =this.form.rules[this.prop]
      const value =this.form.model[this.prop]
      // 执行校验
      const validator=new Validator({[this.prop]:rules})
      // 校验时传入数据源
      return validator.validate({[this.prop]:value},err=>{ //返回promise
          // err存在则校验失败
          if(err){
              this.error=err[0].message
          }else{
              this.error=""
          }
      })
    },
  },
};
</script>

<style>
</style>