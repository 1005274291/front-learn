export default function createStore(reducer,enhancer){
    //enhancer是中间件的返回结果
    if(enhancer){
        //enhancer是用于加强store.dispatch的 加强完需要reducer进行修改状态
        return enhancer(createStore)(reducer)
    }
    let currentState //store state
    let currentListeners=[] //监听函数的数组
    dispatch({type:"dawjkhdiouawhdiowahidowa"})
    function getState(){
        return currentState
    }
    function dispatch(action){
        currentState=reducer(currentState,action)
        currentListeners.forEach(listener=>listener())
    }
    function subscribe(listener){
        currentListeners.push(listener)
        return ()=>{
            currentListeners= currentListeners.filter((fn)=>{
                return fn !==listener
            })
        }
    }

    return {
        getState,
        dispatch,
        subscribe
    }
}