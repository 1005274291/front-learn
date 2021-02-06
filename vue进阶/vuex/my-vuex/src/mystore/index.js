import Vue from 'vue'
import Vuex from './mystore'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    counter:0
  },
  mutations: {
    add(state,number1){
      return state.counter +=number1
    }
  },
  getters: {
    double(state){
      return state.counter *2
    }
  },
  actions: {
    add({commit},num){
      setTimeout(()=>{
        commit("add",num)
      },1000)
    }
  },
  modules: {
  }
})
