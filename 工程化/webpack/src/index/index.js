import {a} from "./user"
import "css/index.css"
import "css/index.less"
import pic from "../images/1.jpg"
// import "../svg/egg.svg"
import "../svg/index"//自动了加载了所有的svg
let h1= document.createElement("h1")
let img =new Image()
h1.innerText=`${a} webpack`
img.src=pic
img.classList.add("logo")
document.body.appendChild(h1)
document.body.appendChild(img)

const arr=[new Promise(()=>{}),new Promise(()=>{})]

arr.map(item=>{
    console.log(item)
})