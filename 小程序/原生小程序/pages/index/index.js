// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  // 事件处理函数
  btnTap() {
    wx.navigateTo({
      url: '/pages/page2/page2'
    })
  },
  openMap(){
    wx.getLocation({//获取地址坐标
      success(res){
        console.log(res)
        //把位置展示出来
        // wx.openLocation({
        //   latitude: res.latitude,
        //   longitude: res.longitude,
        // })
        //选择目的地周围标志性建筑
        wx.chooseLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          success(res){
            console.log(res)//拿到周边建筑的位置信息
          }
        })
      }
    })
  },
  getstep(){
    wx.login({
      success(lres){//login的code去换取accesstoken
        wx.getWeRunData({
          //调用微信sdk获取用户的近一个月的步数
          success: (result) => {
            console.log(result)//获取到加密的数据
            // wx.request({
            //   url: 'url',
            //   data:{
            //     code:lres.code,
            //     iv:result.iv,//解密的密钥
            //     encrypteddata:result.encryptedData//发送加密数据
            //   },
            //   method:"POST",
            //   success(res){
            //     console.log(res)
            //   }
            // })

            //呼叫云函数
            wx.cloud.callFunction({
              name:"getwxRunData",
              data:{
                werundata:wx.cloud.CloudID(result.cloudID)
              },
              success(res){
                console.log(res)
              }
            })
          },
        })
      }
    })
    
  },
  getbook(){
    wx.scanCode({
      //扫码
      success(res){
        wx.cloud.callFunction({
          name:"getbook",
          data:{
            isbn:res.result
          },
          success(res){
            console.log(res)
          }
        })
      }
    })
  },
  onLoad() {
    
  },
  
})
