import {compose} from "../函数式编程/index"
export default function applyMiddleware(...middlewares) {
    return createStore => reducer => {
        const store = createStore(reducer)
        let dispatch = store.dispatch
        // 加强store.dispatch
        const midApi = {
            getState: store.getState,
            dispatch: action => dispatch(action)//传递过去的dispatch绑定了当前作用域  互相不会影响
        }

        const middlewareChain= middlewares.map(middleware => middleware(midApi))//每一个中间件接受参数后返回一个函数
        //每一个中间件返回的函数去处理dispatch
        //重新赋值一个函数
        dispatch=compose(...middlewareChain)(dispatch)

        // 返回加强版，加强store,dispatch
        return {
            ...store,
            dispatch
        }
    }
}