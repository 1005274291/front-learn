import React,{Component} from 'react'
import {RouterContext} from "./routerContext"


export default class Redirect extends Component{
    render(){
        return(
            <RouterContext.Consumer>
                {context=>{
                    const {history}=context
                    const {to,push=false}=this.props
                    //由于react组件不能直接从context跳走需要返回一个实际的子组件，所以从子组件的生命周期挑走
                    return(
                        <LifeCyle
                        onMount={
                            ()=>{
                                push?history.push(to):history.replace(to)
                            }
                        }
                        >
                        </LifeCyle>
                    )
                }}
            </RouterContext.Consumer>
        )
    }
}
class LifeCyle extends Component{
    componentDidMount(){
        if(this.props.onMount){
            this.props.onMount.call(this,this)
        }
    }
    render(){
        return null
    }
}