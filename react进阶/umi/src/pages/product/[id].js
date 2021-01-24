import React from 'react'; 
// 动态路由参数命名格式[:变量名].js结尾
export default props=>{
    const {id} =props.match.params
    return(
        <div>
            <h1>page id:{id}</h1>
            <h5>product</h5>
        </div>
    )
}