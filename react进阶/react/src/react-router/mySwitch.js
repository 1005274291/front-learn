import React,{Component} from "react"
import matchPath from "./matchPath";
import {RouterContext} from "./routerContext"

// 独占路由
// 渲染与该地址匹配的第一个子节点<Route>或者Redirect
// 遍历子节点，找到匹配的就走了
export default class Switch extends Component{
    render(){
        return(
            <RouterContext.Consumer>
                {context=>{
                    //可以给switch 传递location
                    const location =this.props.location ||context.location
                    let match; //标记匹配
                    let element ; //记录匹配的元素
                    //遍历children 找到匹配的Route让对应的Route进行渲染
                    React.Children.forEach(this.props.children,child=>{
                        if(match==null && React.isValidElement(child)){
                            //如果没有匹配过，undefined == null为true 并且子元素是和合法元素
                            element =child
                            match =child.props.path ?matchPath(location.pathname,child.props):context.match
                        }
                    })
                    //如果switch已经计算了match就不需要在route中再计算一次
                    return match ?React.cloneElement(element,{computedMatch:match}) :null
                }}
            </RouterContext.Consumer>
        )
    }
}