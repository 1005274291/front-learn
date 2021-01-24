//由于如果一开始就把所有model加载了会严重的影响性能，并且狠多model也根本用不到，所以我们可以在路由切换的时候动态加载model
import dynamic from "dva/dynamic"
import {app} from "../index"


export const UserPageDynamic=dynamic({
    app,//dva返回的对象
    models:()=>[import("../models/user")],//组件依赖的model数组
    component:()=>import("../routes/UserPage")//要渲染的组件
})
// dynamic.setDefaultLoadingComponent(Component) 设置加载过程中得过渡组件