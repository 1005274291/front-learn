import React, { Component, useContext } from "react"
import { RouterContext } from "./routerContext"

// export default function Link({to,children,...resProps}){
//     const context =useContext(RouterContext)
//     const handleClick=event=>{
//         event.preventDefault()
//         context.history.push(to)
//     }
//     return (
//         <a href={to} {...resProps} onClick={handleClick}>
//             {children}
//         </a>
//     )
// }

export default class Link extends Component {
    static contextType = RouterContext
    handleClick = event => {
        event.preventDefault()
        debugger
        this.context.history.push(this.props.to)
    }
    render() {
        const { to, children, ...restProps } = this.props
        return (
            <a href={to} onClick={this.handleClick} {...restProps}>{children}</a>
        )
    }
}