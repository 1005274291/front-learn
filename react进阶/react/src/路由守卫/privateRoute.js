import React from "react"
import { Route, Redirect } from "react-router-dom"


export default function PrivateRoute({ isLogin, component: Component, ...restProps }) {
    return (
        <Route {...restProps}
            render={props => (
                isLogin ? (
                    <Component {...props}></Component>
                ) :
                    (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: props.location.pathname }
                            }}
                        ></Redirect>
                    )
            )}
        >
        </Route>
    )
}
// 大型项目需要redux的配合
//将需要权限的路由包裹在里面，并且用connect从store中获取登录态
//如果登录态通过就开放对应的路由，如果没有通过会重定向到登录页面并传递当前的pathname到location.state中
//登录页通过connect从store中获取登录信息，，当用户提交信息，登录页通过dispatch提出像reducer修改状态
//状态修改完毕会更新登录信息，，如果登录信息通过校验会通过location.state中的路由信息重定向过去