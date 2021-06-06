<template>
  <div class="container">
    <VirtualList :listData="articles"></VirtualList>
  </div>
</template>

<script>
export default {
  components:{
    VirtualList
  },
  data(){
    return {
      articles:[]
    }
  },
  async mounted(){
    let ret = await this.$http.get('/article')
    if(ret.code==0){
      this.articles = ret.data
    }
  }
}
</script>

<style>

</style>
