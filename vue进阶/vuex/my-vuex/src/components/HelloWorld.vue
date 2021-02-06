<template>
  <div class="hello">
    <p @click='$store.commit("add",5,2)'>{{$store.state.counter}}</p>
    <p @click="$store.dispatch('add',10)">{{$store.state.counter}}</p>
    <p>{{$store.getters.double}}</p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted(){
    console.log(this.$store.getters)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
