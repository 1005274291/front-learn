import React, { Component } from "react"
import "./hoc.css"
// hoc:是一个函数，接受一个组件作为参数，返回另外一个组件

const foo = Cmp => props => {
    return (
        <div className="greenBorder">
            <Cmp {...props}></Cmp>
        </div>
    )
}
//装饰器模式只能用在class上 执行顺序从下至上
@foo
@foo
class Child extends Component {
    render(){
        return <div>Child {this.props.name}</div>
    }
}
//可以链式调用
const Foo=foo(foo(Child))

export default class HocPage extends Component {
    render() {
        return (
            <div>
                <h3>HocPage</h3>
                <Foo name="jun"></Foo>
                <Child></Child>
            </div>
        )
    }
}