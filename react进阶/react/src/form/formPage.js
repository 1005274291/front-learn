import React, { Component, useEffect } from "react"
import Form, { Field } from "./index"


const nameRules = { required: true, message: "请输入姓名！" }
const passworRules = { required: true, message: "请输入密码" }

export default function MyForm(props) {
    const [form] = Form.useForm()

    const onFinish = val => {
        console.log("onfinish", val)
    }
    // 表单校验失败执行
    const onFinishFailed = (err, state) => {
        console.log("onFinishFailed", err, state)
    }
    useEffect(() => {
        // 暴露给用户的formstore和Form组件使用的form需要是一个
        form.setFieldValue({ username: "default" });
    }, [])

    return (
        <div>
            <h3>MyForm</h3>
            <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
                <Field name='username' rules={[nameRules]}>
                    <input placeholder="input UR Username"></input>
                </Field>
                <Field name="password" rules={[passworRules]}>
                    <input placeholder="input UR Password"></input>
                </Field>
                <button>Submit</button>
            </Form>
        </div>
    )
}


// export default class MyForm extends Component {
//     formRef=React.createRef()
//     onFinish = val => {
//         console.log("onfinish", val)
//     }
//     // 表单校验失败执行
//     onFinishFailed = (err, state) => {
//         console.log("onFinishFailed", err, state)
//     }
//     componentDidMount() {
//         this.formRef.current.setFieldValue({username: "default"})
//     }
//     render() {
//         return (
//             <div>
//                 <h3>MyForm</h3>
//                 <Form ref={this.formRef} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed}>
//                     <Field name='username' rules={[nameRules]}>
//                         <input placeholder="input UR Username"></input>
//                     </Field>
//                     <Field name="password" rules={[passworRules]}>
//                         <input placeholder="input UR Password"></input>
//                     </Field>
//                     <button>Submit</button>
//                 </Form>
//             </div>
//         )
//     }
// }