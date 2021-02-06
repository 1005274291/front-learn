//在没有被route直接包裹的组件拿到routerprops，可以包裹一个高阶组件
import React from "react"
import {RouterContext} from "./routerContext"

const withRouter =WrappedComponent=>props=>{
    return(
        <RouterContext.Consumer>
            {context=>{
                return(
                    <WrappedComponent {...props} {...context}></WrappedComponent>
                )
            }}
        </RouterContext.Consumer>
    )
}

export default withRouter
