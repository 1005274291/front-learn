import React from "react"
import useForm from "./useForm"
import FieldContext from "./fieldContext"
export default function Form({ children,onFinish,onFinishFailed,form },ref) {
    const [formInstance] = useForm(form)
    //将实例暴露给父组件的ref
    React.useImperativeHandle(ref,()=>formInstance)
    formInstance.setCallback({
        onFinish,
        onFinishFailed
    })
    return (
        <form onSubmit={e=>{
            e.preventDefault()
            formInstance.submit()
        }}>
            <FieldContext.Provider value={formInstance}>
                {children}
            </FieldContext.Provider>
        </form>
    )
}