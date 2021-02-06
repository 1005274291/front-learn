import React from "react"


//使用context跨层级传递数据


//step1：先创建一个context对象

export const RouterContext =React.createContext()

//step2: 使用Provider传递value
//step3：子孙组件消费value：ContextType,Consumer,useContext