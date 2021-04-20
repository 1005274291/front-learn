<template>
  <div class="hello">
    <ul>
      <li v-for="item in formItems" :key="item.text">
        <span v-html="getItem(item)"></span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Form',
  created () {
    fetch('http://localhost:2333/form/1')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        this.formItems = data;
      });
  },
  data () {
    return {
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
