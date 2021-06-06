<template>
  <div ref="list" class="kkb-list-container" @scroll="scrollEvent">
      <div class="kkb-list-phantom" :style="{height:listHeight+'px'}"></div>
      <div class="kkb-list" :style="{top:getTop}">
          <ArticleItem
          class="kkb-list-item"
          v-for="item in visibleData"
          :key="item._id"
          :article='item'
          :style="{height:size+'px'}"
          ></ArticleItem>
      </div>
  </div>
</template>

<script>
import ArticleItem from './ArtiicleItem.vue'
export default {
    components:{
        ArticleItem
    },
    props:{
        listData:{
            type:Array,
            default:()=>[]
        },
        size:{
            type:Number,
            default:200
        }
    },
    computed:{
        listHeight(){
            //所有文章列表的总高度
            return this.listData.length*this.size
        },
        getTop(){
            //文章的偏移量
            return `${this.startOffset}px`
        },
        visibleCount(){
            //可视区域可以展示文章的数量
            return Math.ceil(this.screenHeight/this.size)
        },
        visibleData(){
            //可视区域用到的列表数据
            return this.listData.slice(this.start,Math.min(this.end,this.listData.length))
        }
    },
    data(){
        return{
            screenHeight:800,//可视区域高度
            startOffset:0,//文章偏移量
            start:0,//文章开始索引
            end:4//文章结束索引
        }
    },
    mounted(){
        this.end=this.start+this.visibleCount
    },
    methods:{
        scrollEvent(){
            let scrollTop=this.$refs.list.scrollTop

            this.start=Math.floor(scrollTop/this.size)
            this.end=this.start+this.visibleData
            this.startOffset=scrollTop-(scrollTop%this.size)
        }
    }
}
</script>

<style scoped>
    .kkb-list-container{
        height: 100%;
        overflow: auto;
        position: relative;
    }
    .kkb-list-phantom{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        z-index: -1;
    }
    .kkb-list{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
    }
</style>