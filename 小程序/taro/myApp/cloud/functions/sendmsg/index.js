// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const result =await cloud.openapi.subscribeMessage.send({
    touser:wxContext.OPENID,//正常应在在数据库中查找经过用户统一的openId,这里使用了当前用户的openId
    page:"index",//用户点击消息跳哪个页面
    lang:"zh_CN",
    data:{
      name1:{
        value:"王为"
      },
      time10:{
        value:"2020-07-18 08:05"
      }
    },
    templateId:"I6U50un-5UkERqvRzBkRkVK50tbl4RxaAJhzVtusing",
    miniprogramState:"developer"
  })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}