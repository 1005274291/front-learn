import React, { Component } from "react"
import { ThemeContext, UserContext } from "./context"

export default class ConsemerPage extends Component {
    render() {
        return (
            <div>
                <h3>ConsumerPage</h3>
                {/* consumer 可以用于函数组件和class组件 并且可以接收多个context */}
                <ThemeContext.Consumer>
                    {themeContext => (
                        <div>
                            <h3>主题色是{themeContext.themeColor}</h3>
                            <UserContext.Consumer>
                                {UserContext => <h4>用户名是{UserContext.name}</h4>}
                            </UserContext.Consumer>
                        </div>
                    )}
                </ThemeContext.Consumer>
            </div>
        )
    }
}