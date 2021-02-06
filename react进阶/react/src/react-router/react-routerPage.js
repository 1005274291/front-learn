import React, { Component } from "react"
import { useHistory, useLocation, useRouteMatch, useParams } from "./hooks"
// import Route from "./myRoute"
// import Link from "./link"
// import Router from "./browserRouter"
// import Switch from "./mySwitch"
// import withRouter from "./mywithRouter"
// import Redirect from "./myRedirect"
// import Prompt from "./myPrompt"
import PrivateRoute from "../路由守卫/privateRoute"
import {Prompt,BrowserRouter as Router,Link,Route,withRouter,Redirect,Switch} from "react-router-dom"
export default class RouterPage extends Component {
    render() {
        return (
            <div>
                <h1>RouterPage</h1>
                <Router>
                    <nav>
                        <Link to="/">首页</Link>
                        <Link to="/user">用户中心</Link>
                        <Link to="/login/123">登录</Link>
                    </nav>
                    {/* 根路由要添加exact，实现精确匹配 */}
                    {/* 实现Route匹配的三种方式 children(在不设置Switch的情况下，children会在location不匹配的情况下显示)>comeponent(渲染component的时候会调用React.createElement，如果使用下面这种匿名函数的形式，每次都会生成一个新的匿名的函数,导致生成的组件的type总是不相同，这个时候会产生重复的卸载和挂载)>render((routerprops)=><Component {...routerprops}/>) */}
                    <Switch>
                        <Route exact path="/" component={() => <div>首页</div>} />
                        {/* <Route path="/user" render={() => <div>用户中心</div>} /> */}
                        <PrivateRoute path="/user" component={User}></PrivateRoute>
                        {/* <Route path="/login/:xx" component={Product}></Route> */}
                        <Route path="/login/:xx" render={() => <Product ></Product>}></Route>
                        {/* <Route path="/login/123" component={(props) => <Login {...props}></Login>}></Route> */}
                        <Route path="/404">404</Route>
                    </Switch>
                    {/* 如果没有设置path 就利用父组件传过来的match */}
                </Router>
            </div>
        )
    }
}

// function Product(props) {
//     // console.log(props) 在被Route直接传递routerprops的情况下
//     // const { match } = props
//     // const { url } = match
//     // const { xx } = match.params //获取动态参数
//     const history = useHistory() //在和Route跨层级的函数组件中
//     const location = useLocation()
//     const match = useRouteMatch()
//     const params = useParams()
//     const { url } = match
//     return (
//         <div>
//             <h4>参数是：{params.xx}</h4>
//             <Link to={url + "/" + params.xx + "4"}>去子路由</Link>
//             {/* <Route path={url + "/:detail"} component={Pdd}></Route> */}
//             <Route path={url + "/:detail"} children={(props)=><Pdd {...props}></Pdd>}></Route>
//             {/* children在没有switch包裹的情况下，即使没有匹配到也会渲染 ，而此时没有routerprops*/}
//         </div>
//     )
// }

@withRouter
class Product extends Component {
    render() {
        const { match } = this.props
        const { url } = match
        const { xx } = match.params
        return(
            // <Redirect to={"/404"}></Redirect>
            <div>
                <h5>Product</h5>
                <Prompt when={true} message="你确定要离开吗"></Prompt>
            </div>
        )
        // return (
        //     <div>
        //         <h4>参数是：{xx}</h4>
        //         <h5>url是：{url}</h5>
        //     </div>
        // )
    }
}

function Login(props) {
    console.log(props)
    return (
        <div>
            登录
        </div>
    )
}
function Pdd(props) {
    return (
        <div>
            <p>匹配上了</p>
            {props.match && props.match.params && props.match.params.detail}
        </div>
    )
}

function User(props){
    return(
        <div>用户中心</div>
    )
}