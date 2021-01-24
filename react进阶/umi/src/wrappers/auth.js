import {Redirect} from "umi"

export default (props)=>{
    const ismore=false//校验子组件是否应该被渲染
    if(ismore){
        return <div>
            {props.children}
        </div>
    }else{
        return <Redirect to="/product"></Redirect>
    }
}