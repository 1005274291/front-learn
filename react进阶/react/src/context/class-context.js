import React, { Component } from "react"
import { ThemeContext, UserContext } from "./context"
import ContextTypePage from "./contextTypePage"
import ConsumerPage from "./consumerPage"
import UseContextPage from "./useContextPage"
export default class ContextPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            theme: {
                themeColor: "red"
            },
            user: {
                name: 'jun'
            }
        }
    }
    render() {
        const { theme, user } = this.state
        console.log(theme)
        return (
            <div>
                <ThemeContext.Provider value={theme}>
                    <ContextTypePage />
                    <UserContext.Provider value={user}>
                        <ConsumerPage />
                        <UseContextPage/>
                    </UserContext.Provider>
                </ThemeContext.Provider>
            </div>
        )
    }
}