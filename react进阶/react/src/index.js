// import Reactdom from "./react17/myreact-dom"//初次渲染逻辑
import Reactdom,{useState} from "./react17/myfiber"//react17fiber架构和更新逻辑
import "./react17/myreact17.css"
import React from "react"
// import Reactdom from "react-dom"
import Component from "./react17/mycomponent"
class ClassComponent extends Component {//class 要放在自掉方法前面执行不存在变量提升，因为继承时字类要在父类之后定义
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="border">
                <p>{this.props.name}</p>
            </div>
        )
    }
}
const jsx = (
    <div className="border">
        <p>全站</p>
        <a href="https://www.kaikeba.com">开课吧</a>
        <FunctionComponent name="函数组件"></FunctionComponent>
        <ClassComponent name="类组件"></ClassComponent>
        <ul>
            {
                ['1', '2', '3'].map(item => {
                    return (
                        <React.Fragment key={item}>
                            <li>{item}</li>
                        </React.Fragment>
                    )
                })
            }
        </ul>
    </div>
)
console.log(React.version)

Reactdom.render(jsx, document.getElementById("root"))


function FunctionComponent(props) {
    const [count,setCout]=useState(0)
    return (
        <div className="border">
            <p>{props.name}</p>
            <button onClick={()=>{
                console.log(count,"count")
                setCout(count+1)
            }}>{count+""}</button>
            {count %2 ==0? <p>{props.name}</p> :<span>omg</span>}
        </div>
    )
}

