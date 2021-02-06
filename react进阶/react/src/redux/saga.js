import {call,put,take,takeEvery,fork} from "redux-saga/effects"
//调用异步操作  call(阻塞下面的代码) fork(不阻塞下面的代码)


//状态更新  put(dispatch)

//做监听  take(监听一次子saga) takeEvery(并行监听多次子saga)

//redux-saga里是generator函数
//worker saga
function* addHandle(action){
    try{
        //发起异步请求
        const res1=yield call(asyncfn,action.payload)
        console.log(action.payload,res1,"res")
        //状态更新
        yield put({type:"ADD",payload:res1})
    }catch(err){
        console.log(err)
    }
}

//watcher saga

function * addSaga(){
    //监听ADDsaga(在页面dispatch({type:"test"})时，redux-saga会将其拦截,解析其中的type,如果等于注册的saga,saga触发监听回调，监听回调接受action)
    yield takeEvery("test",addHandle)//监听子saga dispatch通过type调用

    //利用take实现监听
    // const action =yield take("test") //拿到action
    // yield call(addHandle,action) //将action传递给处理函数
}
// const takeEvery=(pattern,saga)=>{
//     fork(function*(){//执行生成器函数返回迭代器对象
//         while(true){//只有dispatch时才会触发next()不会一次执行完所以不会造成死循环
//             const action =yield take(parent)
//             yield fork(saga,action)
//         }
//     })
// }
function asyncfn(data){
    console.log(data)
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve(data+5)
        },500)
    })
}

export default addSaga