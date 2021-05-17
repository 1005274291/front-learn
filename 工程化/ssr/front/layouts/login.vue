<template>
  <div>
      <div>导航</div>
      <Nuxt></Nuxt>
      <div>底部信息</div>
  </div>
</template>

<script>
export default {
    
}
</script>
<style>
  .login-container{
    width: 100%;
    min-height: 100%;
  }
  .login-form{
    width: 520px;
    padding: 160px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .title-container{
    text-align: center;
    margin-bottom: 20px;
  }
  .title-container img{
    width: 200px;
  }
  .captcha-container{
    width: 340px;
    position: relative;
  }
  .captcha-container .captcha{
    position: absolute;
    right: -110px;
  }
  .captcha-container .el-button{
    width:  90px;
    padding: 0;
    line-height: 40px;
  }
  .captcha-container img{
    width: 90px;
    height: 50px;
    cursor: pointer;
  }
</style>