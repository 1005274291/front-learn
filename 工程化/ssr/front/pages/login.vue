<template>
  <div class="login-container">
      <el-form class="login-form" label-width=100px :model="form" :rules="rules" ref="loginForm">
          <div class="title-container">
              <img src="/logo.jpg" alt="">
          </div>
          <el-form-item prop="email" label="邮箱">
              <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="captcha" label="验证码" class="captcha-container">
              <div class="captcha">
                  <img :src="code.captcha" alt="" @click="resetCaptcha">
              </div>
              <el-input v-model="form.captcha" placeholder="请输入验证码"></el-input>
          </el-form-item>
          <el-form-item prop="emailcode" label="邮箱验证码" class="captcha-container">
              <div class="captcha">
                  <el-button @click="sendEmailCode" :disabled="send.timer>0" type='primary'>{{sendText}}</el-button>
              </div>
              <el-input v-model="form.emailcode" placeholder="请输入邮箱验证码"></el-input>
          </el-form-item>
          <el-form-item prop="passwd" label="密码">
              <el-input v-model="form.passwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click.native.prevent="handleLogin">登录</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
import md5 from 'md5'
export default {
    layout:"login",
    data(){
        return{
            form:{
                email:"1005274291@qq.com",
                captcha:"",
                passwd:"a123456d",
                emailcode:''
            },
            rules:{
                email:[
                    {required:true,message:"请输入邮箱"},
                    {type:"email",message:"请输入正确的邮箱格式"}
                ],
                captcha:[
                    {required:true,message:"请输入验证码"}
                ],
                emailcode:[
                    {required:true,message:"请输入邮箱验证码"}
                ],
                passwd:[
                    {required:true,pattern:/^[\w-]{6,12}$/g,message:"请输入6-12位密码"}
                ]
            },
            code:{
                captcha:"/api/captcha?_t"+new Date().getTime()
            },
            send:{
                timer:0
            }
        }
    },
    computed:{
        sendText(){
            if(this.send.timer<=0){
                return "发送验证码"
            }
            return `${this.send.timer}s后发送`
        }
    },
    methods:{
        //重置验证码
        resetCaptcha(){
            this.code.captcha="/api/captcha?_t"+new Date().getTime()
        },
        //处理点击注册按钮之后的逻辑
        handleLogin(){
            this.$refs.loginForm.validate(async valid=>{
                if(valid){
                    // 校验成功
                    let obj={
                        email:this.form.email,
                        passwd:md5(this.form.passwd),
                        captcha:this.form.captcha,
                        emailcode:this.form.emailcode
                    }
                    let ret =await this.$http.post("/user/login",obj)
                    if(ret.code===0){
                        // 请求成功
                        //将返回的token进行存储
                        this.$message.success("登陆成功")
                        localStorage.setItem("token",ret.data.token)
                        setTimeout(()=>{
                            this.$router.push("/")
                        },500)
                    }else{
                        //请求失败
                        this.$message.error(ret.message)
                    }
                }else{
                    // 校验失败
                    console.log("校验失败")
                }
            })
        },
        async sendEmailCode(){
            //请求邮箱验证码接口
            await this.$http.get("/sendcode?email="+this.form.email)
            this.send.timer=10
            this.timer=setInterval(() => {
                this.send.timer -=1
                if(this.send.timer===0){
                    clearInterval(this.timer)
                }
            }, 1000);
        }
    }
}
</script>

<style>

</style>