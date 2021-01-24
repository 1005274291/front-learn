const { eventNames } = require('process')

//回调函数处理异步
const logTime=(name)=>{
    //定义一个同步函数
    console.log(`Log${name}`+new Date().toLocaleDateString())
}
//定义一个异步函数，在异步完成之后执行同步函数
exports.callback=()=>{
    setTimeout(()=>{
        logTime('callback 1')
        //如果想让下一个异步函数和上一个异步函数顺序执行，那么需要写在上一个异步函数的回调里面形成回调地狱
        setTimeout(()=>{
            logTime('callback 2')
        },100)
    },100)
}

//promise处理异步

const promise =(name,delay=100)=>new Promise((resolve,reject)=>{
    setTimeout(()=>{
        logTime(name)
        resolve()
    },delay)
})
//promise是链式调用处理异步
exports.promise=()=>{
    promise('promise 1')
        .then(promise('Promise 2'))
}


//生成器处理异步
exports.generator=()=>{
    const generator=function*(name){
        yield promise(name+1) //执行第一个异步操作
        yield promise(name+2)
        yield promise(name+3)
    }
    let co=generator=>{
        if(it=generator.next().value){
            //有异步promise需要执行就执行
            it.then(res=>{
                //在执行完成的回调里面执行下一个promise
                co(generator)
            })
        }else{
            //没有promise需要执行了就返回
            return
        }
    }
    co(generator('generator'))
}

//async/awit处理异步
exports.asyncAwait=async()=>{
    await promise('Async/Await 1')
    await promise('Async/Await 2')
    await promise('Async/Await 3')
    await promise('Async/Await 4')
}

//事件驱动处理异步
exports.event=async ()=>{
    const asyncFun=name=>event=>{
        //先接收数据，后接收事件对象，在异步完成后派发事件
        setTimeout(()=>{
            logTime(name)
            event.emit("end")
        },100)
        return event
    }
    const ary=[
        asyncFun('event 1'),
        asyncFun('event 2'),
        asyncFun('event 3')
    ]
    const {EventEmitter} =require('events')
    const event=new EventEmitter()//实例化事件对象
    let i=0
    event.on('end',()=>i<ary.length&&ary[i++](event))//当监听到end事件并且没有越界执行一个异步函数
    event.emit('end') //初始化执行第一个任务
}

//自己实现一个发布订阅模式
class MyEventEmitter{
    constructor(){
        this.handlers={}
    }
    on(eventName,callback){
        if(!this.handlers){
            this.handlers={}
        }
        if(!this.handlers[eventName]){
            this.handlers[eventName]=[]
        }
        this.handlers[eventName].push(callback)
    }
    emit(eventName,...args){
        if(this.handlers[eventName]){
            for(var i=0;i<this.handlers[eventName].length;i++){
                this.handlers[eventName][i](...args)
            }
        }
    }
}