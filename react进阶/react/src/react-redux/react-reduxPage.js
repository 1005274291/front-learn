import React, { Component, useCallback, useContext } from "react"
import { connect ,useDispatch,useSelector} from './connect和provider'
import { bindActionCreators } from "./bindActionCreators"
import { useStore } from "react-redux";


//类组件用connect
class ReactReduxPage extends Component {
    render() {
        const { add, count } = this.props;
        return (
            <div>
                <h3>ReactReduxPage</h3>
                <button onClick={() => add()}>{count}</button>
            </div>
        )
    }
}

// export default connect(
//     state=>{
//         console.log(state)
//         return{
//             count:state.count1
//         }
//     },
//     (dispatch)=>{
//         //慎重定义ownProps，因为你一旦定义ownProps，那么每当ownProps发生改变的时候，当前的 mapStateToProps都会被调用，容易影响性能
//         let creators={
//             add:payload=>({type:"ADD",payload})
//         }
//         // bindActionCreators将creators对象解构，并将对象中的函数返回值包一层dispatch重新组成一个新的对象
//         creators=bindActionCreators(creators,dispatch)
//         return {...creators}
//     }
// )(ReactReduxPage)


export default function ReactReduxHooksPage(props) {
    // 获取state
    const state = useSelector((state) => {
        return {
            count: state.count1
        }
    })

    //获取dispatch
    const dispatch = useDispatch()
    const add = useCallback(() => {
        dispatch({ type: 'ADD' })
    }, [])
    return (
        <div>
            <h3>ReactReduxHooksPage</h3>
            <button onClick={() => add()}>{state.count}</button>
        </div>
    )
}

