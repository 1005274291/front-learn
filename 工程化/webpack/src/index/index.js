import { a } from "./user"
import "css/index.css"
import "css/index.less"
import pic from "../images/1.jpg"
// import "../svg/egg.svg"
import "../svg/index"//自动了加载了所有的svg
let h1 = document.createElement("h1")
let img = new Image()
h1.innerText = `${a} webpack`
img.src = pic
img.classList.add("logo")
document.body.appendChild(h1)
document.body.appendChild(img)

const arr = [new Promise(() => { }), new Promise(() => { })]

arr.map(item => {
    console.log(item)
})

// if(module.hot){
//     //如果你配置了模块热替换，要对什么模块文件进行监听，文件变化后怎么处理
//     module.hot.accept("./user",(err)=>{
//         if (err) {
//             console.log("热替换出BUG了")
//         }
//         else{
//             h1.innerText=`${a} webpack`
//         }
//     })
// }


//按需加载实现代码分割 实现原理是动态创建script标签
// document.onclick = async function () {
//     //懒加载
//     let { a } = await import(
//         /*webpackChunkName:"user",webpackPrefetch:true*/
//         "./user.js"
//     )//会多生成一个js文件（文件名是chunkid也可以通过上方的注释自己指定），再触发时再进行加载
//     h1.innerText = `${a} webpack`
// }


//设置webpackPrefetch可以实现预加载，就是在整个页面加载完成之后利用浏览器空余时间加载资源，但是只有在触发一定条件时才执行
//实现的原理是动态创建link标签 将rel设置为prefetch as设置为script href设置为预加载资源路径