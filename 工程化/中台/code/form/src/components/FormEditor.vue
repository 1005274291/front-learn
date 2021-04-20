<template>
  <div class="hello">
    <ul>
      <li v-for="item in formItems" :key="item.text">
        <span v-html="getItem(item)"></span>
      </li>
    </ul>
    文本 <input v-model="text"/> 类型
    <select v-model="type">
      <option>input</option>
      <option>textarea</option>
      <option>button</option>
      <option>source</option>
    </select>
    <button @click="addItem">添加</button> <br/>
    <button @click="submit">生成页面</button>
  </div>
</template>

<script>
export default {
  name: 'FormEditor',
  data () {
    return {
      text: '',
      type: '',
      formItems: [
      ]
    }
  },
  methods: {
    getItem(item) {
      switch(item.type) {
        case 'button':
          return `<button>${item.text}</button>`;
        default:
          return item.text + '<' + item.type + ' />';
      }
    },
    addItem() {
      this.formItems.push({
        text: this.text,
        type: this.type,
        // 数据源
        source: '',
      });
    },
    submit() {
      fetch('http://localhost:2333/form/1', {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(this.formItems)
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello li {
  display: block;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
