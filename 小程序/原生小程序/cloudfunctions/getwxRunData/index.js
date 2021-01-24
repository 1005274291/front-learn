// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()//腾讯云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()//微信的运行环境
  const werundata=event.werundata//从wx云缓存中凭借openId取出解密的数据
  return werundata
  
}