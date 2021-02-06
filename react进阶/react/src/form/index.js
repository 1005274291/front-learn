import React from "react"
import Field from "./field"
import _Form from "./form"
import useForm from "./useForm"

const Form =React.forwardRef(_Form)//像Form组件传递ref 让ref作用在Form组件中的formStore的实例
Form.useForm=useForm//函数组件接收useform

export {Field,useForm};
export default Form
