import React from "react"


export default (props:any)=>{
    return(
        <div>
            {/* product路由中的内容相当于public */}
            <h1>public</h1>
            {/* 子路由中的内容 */}
            {props.children}
        </div>
    )
}