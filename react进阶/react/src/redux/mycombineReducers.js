export default function combineReducers(reducers) {
    //接收一个各种reducer组成的对象 返回一个总的reducer
    return function (state = {}, action) {
        let nextState = {}//存储新遍历到的reducer改变的state
        let hasChange = false//新遍历到的reducer是否改变了state
        for (let key in reducers) {
            const reducer = reducers[key]
            nextState[key] = reducer(state[key], action)//每一个reducer的state去对应的reducer去找
            hasChange = hasChange || nextState[key] !== state[key] //比较新遍历到的state是否在旧state中存在且值相等
        }
        //比较新遍历到的state和旧state是否个数相同
        hasChange = hasChange || Object.keys(nextState).length !== Object.keys(state).length
        return hasChange ? nextState : state
    }
}
//dispatch=>combinereducer中遍历所有reducer，将action传到对应reducer去处理返回state，比较state是否和之前发生了变化