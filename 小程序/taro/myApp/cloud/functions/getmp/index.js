// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try{
    const result =await cloud.openapi.wxacode.getUnlimited({//获取小程序码（发布后的小程序，返回图片）
      scene:event.scene//传参 如果携带page参数则会跳对应的页面
    })
    return result
  }catch(err){
    return err
  }

}