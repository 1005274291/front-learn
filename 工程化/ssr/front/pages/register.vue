<template>
  <div class="login-container">
      <el-form class="login-form" label-width=100px :model="form" :rules="rules" ref="registerForm">
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
          <el-form-item prop="nickname" label="昵称">
              <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item prop="passwd" label="密码">
              <el-input v-model="form.passwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="repasswd" label="确认密码">
              <el-input v-model="form.repasswd" placeholder="请再次输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click.native.prevent="handleRegister">注册</el-button>
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
                nickname:"军宝",
                passwd:"a123456d",
                repasswd:'a123456d'
            },
            rules:{
                email:[
                    {required:true,message:"请输入邮箱"},
                    {type:"email",message:"请输入正确的邮箱格式"}
                ],
                captcha:[
                    {required:true,message:"请输入验证码"}
                ],
                nickname:[
                    {required:true,message:"请输入昵称"}
                ],
                passwd:[
                    {required:true,pattern:/^[\w-]{6,12}$/g,message:"请输入6-12位密码"}
                ],
                repasswd:[
                    {required:true,message:"请输入确认密码"},
                    {
                        validator:(rule,value,callback)=>{
                            //自定义校验规则的函数
                            if(value!==this.form.passwd){
                                callback(new Error("两次密码不一致"))
                            }
                            //不给callback传递参数认为验证通过
                            callback()
                        }
                    }
                ]
            },
            code:{
                captcha:"/api/captcha?_t"+new Date().getTime()
            }
        }
    },
    methods:{
        //重置验证码
        resetCaptcha(){
            this.code.captcha="/api/captcha?_t"+new Date().getTime()
        },
        //处理点击注册按钮之后的逻辑
        handleRegister(){
            this.$refs.registerForm.validate(async valid=>{
                if(valid){
                    // 校验成功
                    let obj={
                        email:this.form.email,
                        nickname:this.form.nickname,
                        passwd:md5(this.form.passwd),
                        captcha:this.form.captcha
                    }
                    let ret =await this.$http.post("/user/register",obj)
                    if(ret.code===0){
                        // 请求成功

                        this.$alert("注册成功","成功",{
                            confirmButtonText:"去登陆",
                            callback:()=>{
                                this.$router.push("/login")
                            }
                        })
                    }else{
                        //请求失败
                        this.$message.error(ret.message)
                    }
                }else{
                    // 校验失败
                    console.log("校验失败")
                }
            })
        }
    }
}
</script>

<style>

</style>