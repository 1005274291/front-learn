import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text ,Button} from '@tarojs/components'

export default class Index extends Component {
    sub=()=>{
        Taro.requestSubscribeMessage({
            tmplIds:["I6U50un-5UkERqvRzBkRkVK50tbl4RxaAJhzVtusing"],//做多一次授权3个消息模板
            success:(res)=>{
                //用户授权通过我们可以发送订阅了
                console.log(res)
            }
        })
    }
    pub=()=>{
        Taro.cloud.callFunction({
            name:"sendmsg"
        })
    }
    componentWillMount () { 
    }
  
    componentDidMount () {
    }
  
    componentWillUnmount () { }
  
    componentDidShow () {
    }
  
    componentDidHide () { }
  
    render () {
      return (
        <View className='index'>
            <Button onClick={this.sub}>开始订阅消息</Button>
            <Button onClick={this.pub}>发送订阅消息</Button>
            {/* 视频广告在用户量1000的时候可以申请，在需要展示的页面中头部，onload(componentDidMount),按钮的行为函数中填写相应的代码 */}
        </View>
      )
    }
  }