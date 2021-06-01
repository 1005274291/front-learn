<template>
  <div>
    <div class="write-btn">
      <el-button @click="submit" type="primary">提交</el-button>
    </div>
    <el-row>
      <el-col :span="12">
        <!-- markdown编译器 -->
        <textarea class="md-editor" ref="editor" :value="content" @input="update"></textarea>
      </el-col>
      <el-col :span="12">
        <div class="markdown-body" v-html="compiledContent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import marked from "marked";
export default {
  data() {
    return {
      content: `
                # 开课吧
                * 上课
                * 吃饭
                * 写代码
            `,
    };
  },
  mounted() {
    this.timer = null; //非响应式的不会有性能损耗
    this.bindEvents() //绑定监听器
  },
  computed: {
    compiledContent() {
      return marked(this.content);
    },
  },
  methods: {
    update(e) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.content = e.target.value;
      }, 400);
    },
    bindEvents(){
        this.$refs.editor.addEventListener('parse',async e=>{
            //监听粘贴事件 拿到粘贴的图片上传到后端返回前端一个图片url
            //改变this.content的值将图片插入进去
            const files=e.clipboardData.files
        })
        this.$refs.editor.addEventListener('drop',async e=>{
            const files=e.dataTransfer.files
            //监听拖拽图片落入到编译器上
            e.preventDefault()
        })
    },
    submit() {},
  },
};
</script>

<style>
.md-editor {
  width: 100%;
  height: 100vh;
  outline: none;
}
.write-btn {
  position: fixed;
  z-index: 100;
  right: 30px;
  top: 10px;
}
</style>