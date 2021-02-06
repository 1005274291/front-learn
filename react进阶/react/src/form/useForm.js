import React from "react"
// 存储Form的数据
// Antd4采用的formStore类存储数据利用context传递数据 一个input数据变化只会一个input更新
// antd3采用状态提升存到Form组件中，向下传递 一个input数据变化父组件会更新导致子组件也会更新
class FormStore {
    constructor() {
        //这里存储Form要处理的数据
        this.store = {}
        //存储field
        this.fieldEntities=[]
        //注册回调函数
        this.callbacks={}
    }

    setCallback=callback=>{
        this.callbacks={
            ...this.callbacks,
            ...callback
        }
    }
    // 注册field
    registerEntity=entity=>{
        this.fieldEntities.push(entity)
        return ()=>{
            this.fieldEntities=this.fieldEntities.filter(item=>item !==entity)
            delete this.store[entity.props.name]
        }
    }
    getFieldValue=name=>{
        const v=this.store[name]
        return v
    }
    // {name:'omg'}
    setFieldValue=newStore=>{
        this.store={
            ...this.store,
            ...newStore
        }
        this.fieldEntities.forEach(entity=>{
            // 遍历每一个field
            const {name} =entity.props
            Object.keys(newStore).forEach(key=>{
                if(key ===name){
                    entity.onStoreChange()
                }
            })
        })
    }
    validate=()=>{
        let err=[]
        this.fieldEntities.forEach(entity=>{
            const {name,rules}=entity.props
            let value =this.getFieldValue(name)
            let rule=rules&&rules[0]
            if(rule&&rule.required&&(value===undefined||value==="")){
                err.push({[name]:rule.message,value})
            }
        })
        return err
    }

    submit=()=>{
        const {onFinish,onFinishFailed}=this.callbacks
        let err=this.validate()
        console.log(err)
        if(err.length===0){
            // onFinish
            onFinish&&onFinish({...this.store})
        }else{
            // onFinishFailed
            onFinishFailed&&onFinishFailed(err,{...this.store})
        }
    }
    getForm=()=>{
        return {
            getFieldValue:this.getFieldValue,
            setFieldValue:this.setFieldValue,
            registerEntity:this.registerEntity,
            submit:this.submit,
            setCallback:this.setCallback
        }
    }
}
var a=0
// 自定义hook
export default function useForm(form) {
    const formRef =React.useRef()
    a++
    console.log(a)
    // console.log(React.useRef()==React.useRef())
    // 对formStore进行缓存
    if(!formRef.current){
        console.log(a)
        if(form){
            formRef.current=form
        }else{
            const formStore=new FormStore()
            formRef.current=formStore.getForm()
        }
    }
    return [formRef.current]
}