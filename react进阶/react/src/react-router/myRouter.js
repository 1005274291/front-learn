import React,{Component} from "react"
import {RouterContext} from "./routerContext"

export default class Router extends Component{
    //在最外层包裹一次match
    static computeRootMatch(pathname){
        return {path:"/",url:"/",params:{},isExact:pathname==="/"}
    }
    // 监听路由变化，如果路由发生变化让子孙组件进行更新
    constructor(props){
        super(props)
        this.state={
            location:props.history.location
        }
        //监听路由，history实际上是监听的popstate，运用的pushstate改变路由，hash通过监听hashchange，运用的是location.push改变路由
    }
    componentDidMount(){
        this.unlisten= this.props.history.listen(location=>{
            this.setState({location:location.location})
        })
    }
    componentWillUnmount(){
        if(this.unlisten){
            this.unlisten()
        }
    }
    render(){
        return(
            <RouterContext.Provider value={{history:this.props.history,location:this.state.location,match:Router.computeRootMatch(this.state.location.pathname)}}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}