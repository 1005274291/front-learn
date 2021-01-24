// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require("axios")
const doubanbook = require("doubanbook")
cloud.init()
//https://search.douban.com/book/subject_search?search_text=56846
async function getDoubanBook(isbn) {
  const url = "https://search.douban.com/book/subject_search?search_text=" + isbn
  let res = await axios.get(url) //拿到网页的内容
  
  let reg = /window\.__DATA__ = "(.*)"/;
  if (reg.test(res.data)) {
    return doubanbook(RegExp.$1)[0]
  }
}
getDoubanBook(9787514700329)
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    isbn
  } = event

  const res = await getDoubanBook(isbn)

  const db = cloud.database() //连接数据库
  db.collection("books").add({
    data: {
      isbn,
      title: res.title,
      coverurl: res.cover_url
    }
  })
  return {
    title: res.title,
    coverurl: res.cover_url //图片连接
  }
}