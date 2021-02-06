import React,{Component} from "react"
import {RouterContext} from "./routerContext"

export default function Prompt({message,when=true}){
    return(
        <RouterContext.Consumer>
            {context=>{
                if(!when){
                    return null
                }
                let method =context.history.block//获取弹窗的方法
                return(
                    //需要返回一个组件，在组建的生命周期里实现弹窗
                    <LifeCyle
                    // onMount={self=>{
                    //     self.release=method(message)
                    //     console.log(self.release)
                    // }}
                    onMount={()=>{
                        method(message)
                    }}
                    // onUnmount={self=>{
                    //     self.release()
                    // }}
                    >
                    </LifeCyle>
                )
            }}
        </RouterContext.Consumer>
    )
}



class LifeCyle extends Component{
    componentDidMount(){
        if(this.props.onMount){
            console.log(this.props.onMount,"onMount")
            //调用method方法并且将自身传递给父组件，让父组件拿到取消method的方法赋值给自己的一个属性
            // this.props.onMount.call(this,this)
            this.props.onMount()
            console.log("zhixing")
        }
    }
    // componentWillUnmount(){
    //     //在切换到其他路由或者组件卸载时，进行method方法的取消订阅
    //     console.log("xiezai")
    //     if(this.props.onUnmount){
    //         this.props.onUnmount.call(this,this)
    //     }
    // }
    render(){
        return null
    }
}