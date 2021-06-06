<template>
  <el-container>
    <el-header>
      <el-menu mode='horizontal'>
        <el-menu-item index='0'>
          <img src="/logo.jpg" alt="" srcset="">
        </el-menu-item>
        <el-menu-item index='1'>
          <nuxt-link to='/'>首页</nuxt-link>
        </el-menu-item>
        <el-menu-item index='2' v-if="userInfo.id">
          <a href="">退出</a>
        </el-menu-item>
        <el-menu-item index='3' v-if="userInfo.id">
          <a href="">{{userInfo.nickname}}</a>
        </el-menu-item>
        <el-menu-item index='4' v-if="userInfo.id">
          <nuxt-link to='/editor/new'>写文章</nuxt-link>
        </el-menu-item>
        <el-menu-item index='5' v-if="!userInfo.id">
          <nuxt-link to='/register'>注册</nuxt-link>
        </el-menu-item>
        <el-menu-item index='6' v-if="!userInfo.id">
          <nuxt-link to='/login'>登录</nuxt-link>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <Nuxt />
    </el-main>
    <el-footer></el-footer>
  </el-container>
</template>
<script>
export default {
  mounted(){
    this.getUserInfo()//获取用户信息
  },
  methods:{
    async getUserInfo(){
      const token =localStorage.getItem('token')
      if(token){
        this.$store.dispatch('user/detail')
      }
    }
  },
  computed:{
    userInfo(){
      return this.$store.state.user
    }
  }
}
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
