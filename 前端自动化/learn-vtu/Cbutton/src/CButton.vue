<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>

<script>
import { computed, inject } from 'vue'
export default {
  props: ['size'],
  setup(props) {
    const size = useSize(props)
    const classes = useClass(size)
    return {
      classes
    }
  }
}

function useSize(props) {
  return computed(() => {
    //如果size没有通过props传入就检查是否通过inject的方式注入
    const elFormItem = inject('elFormItem', {})
    return props.size || elFormItem.size
  })
}
function useClass(size) {
  return computed(() => {
    //如果设置size就更新类名，否则为空类名
    return [size.value ? `el-button--${size.value}` : '']
  })
}
</script>

<style></style>
