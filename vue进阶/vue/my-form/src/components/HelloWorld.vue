<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <my-form :model="model" :rules="rules" ref="loginForm" @hook:updated="hookupdate('a',$event)">
      <!-- hook事件拿不到$event -->
      <form-item label="用户名" prop="username">
        <myInput
          v-model="model.username"
          placeholder="请输入用户名"
          type="text"
        ></myInput>
      </form-item>
      <form-item label="密码" prop="password">
        <myInput
          v-model="model.password"
          type="password"
        ></myInput>
      </form-item>
      <form-item>
        <button @click="onlogin" >登录</button>
      </form-item>
    </my-form>
  </div>
</template>

<script>

import myInput from "./myinput";
import formItem from "./form-item";
import myForm from "./myform";
export default {
  name: "HelloWorld",
  data() {
    return {
      model: {
        username: "jerry",
        password:""
      },
      rules:{
        username:[
          {required:true,message:"用户名为必填项"}
        ],
        password:[
          {required:true,message:"密码为必填项"}
        ]
      }
    };
  },
  props: {
    msg: String,
  },
  components: {
    myInput,
    formItem,
    myForm
  },
  methods:{
    onlogin(){
      this.$refs.loginForm.validate(isValid=>{
        if(isValid){
          console.log("submitlogin")
        }else{
          alert("失败")
        }
      })
    },
    hookupdate(a,event){
     console.log(a,event) 
    }
  }
};
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
