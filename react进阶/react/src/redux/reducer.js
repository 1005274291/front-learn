// import createStore from "./myredux"
// import applyMiddleware from "./myapplyMiddleware"
// import combineReducer from "./mycombineReducers"
import {createStore,applyMiddleware,combineReducers} from "redux"
import isPromise from "is-promise"
import createSagaMiddleware from "redux-saga"
import rootsaga from "./rootsaga"
export const conterReducer = (state = 0, { type, payload = 1 }) => {
    switch (type) {
        case "ADD":
            return state + payload
        case "MINUS":
            return state - payload
        default:
            console.log(type, "type", state)
            return state
    }
}
export const conterReducer2 = (state = {num:0}, { type, payload = 1 }) => {
    switch (type) {
        case "ADD2":
            return {...state,num:state.num+payload}
        default:
            console.log(type, "type", state)
            return state
    }
}


const sagaMiddleware =createSagaMiddleware()//创建一个saga中间件

const store = createStore(combineReducers({
    count1:conterReducer,
    count2:conterReducer2
}), applyMiddleware(sagaMiddleware))
//注册大saga
sagaMiddleware.run(rootsaga)
export default store


//打印日志
//logger需要放在最内层(中间件的最后一个)，需要保证action为plain object
function logger({dispatch,getState}){
    //next是接收的聚合函数(action)=>{}，如果是最内层接收的dispatch的action为对象，返回一个dispatch函数作为下一个中间件的参数
    return next=>action=>{
        console.log("++++++++++++++++++++++++++++++++++++")
        const prevState=getState()
        console.log("prev state",prevState)
        // 执行dispatch action已经受过异步函数中间件的处理
        const returnValue= next(action)//执行dispatch
        const nextState=getState()
        console.log("prex state",nextState)
        console.log("++++++++++++++++++++++++++++++++++++")
        return returnValue
    }
}

//异步解决方案

function thunk ({dispatch,getState}){
    return next=>action=>{
        //action数据类型可以是对象和函数
        if(typeof action =="function"){
            //如果是函数就把dispatch和getstate传递给他让他执行
            return action(dispatch,getState)
        }
        return next(action)//用以前处理完的dispatch去处理
    }
}
//promise解决方案
function promise({dispatch,getState}){
    return next=>action=>{
        return isPromise(action) ?action.then(dispatch):next(action)
    }
}