import React, { useCallback, useContext, useLayoutEffect, useState } from "react"
import { bindActionCreators } from "./bindActionCreators"


// 通过Context传递store
// 1.创建一个Context对象
const Context = React.createContext()

// 2.通过Provider组件传递value（store）
export function Provider({ store, children }) {
    return <Context.Provider value={store}>{children}</Context.Provider>
}
// 3.子组件接收context (Consumer\contextType\useContext)

export const connect = (
    mapStateToProps,
    mapDispatchToProps
) => WrappedComponent => props => {
    const store = useContext(Context)
    const { getState, dispatch, subscribe } = store
    const stateProps = mapStateToProps(getState())
    let dispatchProps = { dispatch }
    const forceUpdate = useForceUpdate()
    if (typeof mapDispatchToProps === "object") {
        dispatchProps = bindActionCreators(mapDispatchToProps, dispatch)
    } else if (typeof mapDispatchToProps === "function") {
        dispatchProps = mapDispatchToProps(dispatch)
        //可以传入ownprops是组件自己的props也可以是函数
        //如果接收ownprops则props改变每次mapDispatchToProps都会执行  会影响性能
    }
    useLayoutEffect(() => {
        const unsubscribe = subscribe(() => {
            forceUpdate()
        })
        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [])
    return <WrappedComponent {...props} {...stateProps} {...dispatchProps}></WrappedComponent>
}


//hook只能用在函数组件或者自定义hook
function useForceUpdate() {
    const [state, setState] = useState(0)
    const update = useCallback(() => { //缓存更新函数保证每次调用的是一个函数
        setState(prev => prev + 1)
    }, [])
    return update
}

export function useSelector(selector){
    const store =useStore()
    const {getState}=store
    const selectState=selector(getState())
    const forceUpdate = useForceUpdate()
    useLayoutEffect(() => {
        const unsubscribe = store.subscribe(() => {
            forceUpdate()
        })
        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [])
    return selectState
}

export function useDispatch(){
    const store =useStore()
    return store.dispatch
}


function useStore(){
    const store =useContext(Context)
    return store
}