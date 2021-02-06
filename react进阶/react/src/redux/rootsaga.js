import {all} from "redux-saga/effects"
import addsaga from "./saga"

//当有很多saga的时候返回一个saga数组
//generator需要执行一下才能返回生成器对象
export default function* rootsaga(){
    yield all([addsaga()])
}