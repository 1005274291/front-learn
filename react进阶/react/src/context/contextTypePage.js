import React, { Component } from "react"
import { ThemeContext } from "./context"

export default class ContextTypePage extends Component {
    //contextType只能在class组件中使用 并且只能使用一个context否则第二个会对第一个进行覆盖
    static contextType = ThemeContext
    render() {
        const { themeColor } = this.context
        return (
            <div>
                <h3>ContextPage</h3>
                <h3>主题色是{themeColor}</h3>
            </div>
        )
    }
}