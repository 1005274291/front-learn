import React, { useContext } from "react"
import { ThemeContext, UserContext } from "./context"

export default function UseContextPage(props) {
    // useContext只能用于函数组件，但是可以接受多个context
    const themeContext = useContext(ThemeContext)
    const { themeColor } = themeContext
    const userContext = useContext(UserContext)
    const { name } = userContext
    return (
        <div>
            <h3>UserContextPage</h3>
            <h3>主题色{themeColor}</h3>
            <h4>用户名{name}</h4>
        </div>
    )
}