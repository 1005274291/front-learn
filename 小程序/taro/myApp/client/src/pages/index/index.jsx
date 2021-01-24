import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text ,Button} from '@tarojs/components'
import './index.css'

import Login from '../../components/login/index'

export default class Index extends Component {
  gopost=()=>{
    Taro.navigateTo({
      url: '/pages/makeposter/makeposter',
    })
  }
  gosub=()=>{
    Taro.navigateTo({
      url:"/pages/subscribemsg/subscribemsg"
    })
  }
  componentWillMount () { 
  }

  componentDidMount () {
    //解析二维码参数，制作分销
    const paramsUrl=getCurrentInstance().router.params
    var scene=unescape(paramsUrl.scene)
    var params=scene.split("_");
    var dict={}
    for(var i =0;i<params.length;i++){
      var param=params[i].split("=")
      dict[param[0]]=param[1]
    }
    console.log(dict)
  }

  componentWillUnmount () { }

  componentDidShow () {
  }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        {/* <Login/> */}
        <Button type="primary" onClick={this.gopost}>生成海报!!</Button>
        <Button type="primary" onClick={this.gosub}>订阅消息</Button>
      </View>
    )
  }
}
