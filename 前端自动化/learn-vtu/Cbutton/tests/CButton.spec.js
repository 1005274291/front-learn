import {mount} from "@vue/test-utils"
import Cbutton from "../src/CButton.vue"
import {reactive} from "vue"
describe('Cbutton', () => {
    it("用户可以通过slot的方式定义组件内容",()=>{
        const wrapper=mount(Cbutton,{//传入一个插槽
            slots:{
                default:"default button"
            }
        })
        expect(wrapper.text()).toContain("default button")
    })
    it("基于size属性可以设置button的尺寸",async ()=>{
        //happy path 最核心的流程
        const wrapper =mount(Cbutton,{//传入一个props
            props:{
                size:"mini"
            }
        })
        expect(wrapper.classes()).toContain("el-button--mini")//检测类名中是否根据props修改


        await wrapper.setProps({//vue中更新属性是异步的
            size:"small"
        })
        expect(wrapper.classes()).toContain("el-button--small")//用户更改样式类名随之更改
    })

    it("不存在el-button--undefined的类名",()=>{
        //edge cases 边缘情况

        const wrapper =mount(Cbutton)
        console.log(wrapper.classes())

        // expect(wrapper.classes()).not.toContain("el-button--undefined")
        //npm install jest-vtu插件可以帮我们统一判断规则,增强语义化
        expect(wrapper).not.toHaveClass("el-button--undefined")
    })

    it("按钮嵌入到form表单中会来找form表单为按钮注入的设置",()=>{
        const wrapper =mount(Cbutton,{
            global:{
                provide:{
                    elFormItem:reactive({//通过provide的方式从form表单给button注入配置项
                        size:"mini"
                    })
                }
            }
        })

        expect(wrapper.classes()).toContain("el-button--mini")
    })
})
