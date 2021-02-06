import React, { Component } from "react"
import { RouterContext } from "./routerContext"
import matchPath from "./matchPath"

export default class Route extends Component {
    render() {
        return (
            <RouterContext.Consumer>
                {context => {
                    const { location } = context
                    const { path, component, children, render, computedMatch } = this.props
                    const match = computedMatch ? computedMatch : path ? matchPath(location.pathname, this.props) : context.match//如果没有设置path用上一层的match
                    const props = {
                        ...context,
                        location,
                        match
                    }
                    console.log(this.props,location.pathname,123,match)
                    return (
                        <RouterContext.Provider value={props}>
                            {match ?
                                children ? typeof children === "function" ? children(props) : children
                                    : component ? React.createElement(component, props)
                                        : render ? render(props)
                                            : null
                                : typeof children === "function" ? children(props) : children}
                        </RouterContext.Provider>
                    )
                }}
            </RouterContext.Consumer>
        )
    }
}