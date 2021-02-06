import React ,{Component} from "react"
import FieldContext from "./fieldContext"

export default class Field extends Component {
    static contextType=FieldContext
    componentDidMount(){
        this.unregisterEntity= this.context.registerEntity(this)
    }
    componentWillUnmount(){
        if(this.unregisterEntity){
            this.unregisterEntity()
        }
    }
    onStoreChange=()=>{
        this.forceUpdate()
    }
    getCntrolled=()=>{
        const {getFieldValue,setFieldValue}=this.context
        const {name}=this.props
        return{
            //react 非受控组件转受控组件会报错，value为undefined时为非受控组件
            value:getFieldValue(name)||"",
            onChange:e=>{
                const newValue=e.target.value
                setFieldValue({[name]:newValue})
            }
        }
    }
    render(){
        const {children} =this.props
        return React.cloneElement(children,this.getCntrolled())
    }
}