import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { $ } from '@tarojs/extend'
import { View, Text, Button, Canvas } from "@tarojs/components";

export default class Index extends Component {
  state = {
    canvas: null
  };
  gopost = () => {
    wx.navigateTo({
      url: "/pages/makeposter/makeposter"
    });
  };
  save = () => {
    Taro.canvasToTempFilePath({//将canvas转换成图片路径
      canvasId:"myCanvas",
      x:100,
      y:100,
      width:100,
      height:100,
      destHeight:200,
      destWidth:200,
      success:(res)=>{
        console.log(res)
        Taro.saveVideoToPhotosAlbum({
          filePath:res.tempFilePath//把图片地址保存到相册
        })
      }
    })
  };
  componentWillMount() {}

  componentDidMount() {
    //原生小程序
    // const query=Taro.createSelectorQuery()
    // query.select("#myCanvas")
    // .fields({node:true,size:true})//选择需要获取的字段
    // .exec((res)=>{
    //   console.log(res)
    // this.setState({canvas:res[0].node})
    // const ctx=this.state.canvas.getContext("2d")
    // const dpr=Taro.getSystemInfoSync().pixelRatio//或许系统像素信息
    // this.state.canvas.width=res[0].width*dpr
    // this.state.canvas.height=res[0].height*dpr
    // ctx.scale(dpr,dpr)
    // ctx.fillStyle="white"
    // ctx.fillRect(0,0,300,300)
    // })
    const canvas = Taro.createCanvasContext("myCanvas", this);
    const dom =$("#myCanvas")[0]
    const dpr = Taro.getSystemInfoSync().pixelRatio; //或许系统像素信息
    dom.style._value.width=dom.style._value.width.slice(0,-2)*dpr+"px"
    dom.style._value.height=dom.style._value.height.slice(0,-2)*dpr+"px"
    canvas.scale(dpr, dpr);
    canvas.setFillStyle("white")
    canvas.fillRect(0, 0, 300, 300);
    canvas.setFillStyle("red")
    canvas.fillRect(0,0,100,100)
    canvas.draw()

    Taro.cloud.callFunction({
      "name":'getmp',
      data:{
        scene:"a=fromid_b=uid"
      }
    }).then(res=>{
      const src="data:image/jpg;base64,"+Taro.arrayBufferToBase64(res.result.buffer)//canvas转换成base64
      canvas.drawImage(src,100,100,100,100)//将小程序码画在海报上
      canvas.draw(false)//false 是清除上次画布的内容，true是不清除
    })
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    //海报就是将自己得小程序通过申请一个小程序码，那个码是图片，图片是二进制数据，二进制数据存储着我们得连接和生成码传的信息，
    //我们可以把这个小程序码镶嵌在好看的图片中发到朋友圈，当朋友用微信扫一扫扫码的时候就可以读取二进制信息和扫码的参数返回给小程序
    //小程序码有三种类型
    //1.小程序码，和3接口共享100000次，参数页面后带上（最长128字节）
    //2.小程序码，无限个数，只能带scene参数，但可以类似子cookie的形式带多个参数a_fromid|b_uid
    //3.小程序二维码同一
    return (
      <View className="index">
        <Text>这是海报</Text>
        <Canvas
          id="myCanvas"
          canvasId="myCanvas"
          style="width:300px;height:300px;"
        ></Canvas>
        <Button type="default" onClick={this.save}>
          保存到手机相册
        </Button>
      </View>
    );
  }
}
