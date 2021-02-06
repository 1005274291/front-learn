import React, { Component } from "react"
import store from "./reducer"

export default class RudexPage extends Component {
    componentDidMount() {
        this.unsubscribe = store.subscribe(() => {//dispatch之后更新视图
            this.forceUpdate()//只有类组件中存在
        })
    }
    componentWillUnmount() {//卸载后取消订阅
        this.unsubscribe()
    }
    asyAdd = () => {
        store.dispatch((dispatch, getState) => {
            setTimeout(() => {
                dispatch({ type: "ADD" })
            }, 1000)
        })
    }
    add = () => {
        store.dispatch({ type: "ADD", payload: 100 })
    }
    promiseAdd = () => {
        store.dispatch(
            Promise.resolve({
                type: "MINUS",
                payload: 10
            })
        )
    }
    sagaAdd = (num) => {
        return () => {
            store.dispatch({
                type: "test",
                payload: num
            })
        }
    }
    add2 = () => {
        store.dispatch({ type: "ADD2", payload: 10 })
    }
    render() {
        return (
            <div>
                <h3>ReduxPage</h3>
                <div>{store.getState().count1}</div>
                <button onClick={this.add}>加100</button>
                <button onClick={this.asyAdd}>async加100</button>
                <button onClick={this.promiseAdd}>promise加10</button>
                <button onClick={this.sagaAdd(3)}>saga加3</button>
                <button onClick={this.add2}>{store.getState().count2.num}</button>
            </div>
        )
    }
}