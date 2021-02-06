        //what 虚拟dom，用js描述dom的信息和结构的对象，当状态变更的时候，重新渲染这js对象结构 
        //why 虚拟dom dom操作很慢轻微的操作都会导致页面重新排版，非常消耗性能。通过diff算法对比新旧vdom之间的差异，可以是批量的，最小化的执行dom操作，从而提高性能
        //where React中用jsx语法描述图，该函数将vdom来描述真实dom，状态变化vdom进行diff
        //React16 babel-loader会预编译jsx为React.createElement()中的参数
        //16当中react在做事件委托的时候是将监听器挂载到document上，这样如果使用其他的框架或者原生js会互相造成影响
        //16当中如果在监听回调中调用异步函数使用e，需要先调用e.persist()，为了兼容旧浏览器react重用了不同事件的事件对象，并将所有事件字段在它们之前设置为null
        //16当中副作用清理函数无论是useEffect还是useLayoutEffect都是同步执行清理函数
        //16d当中react把一切不想返回的值设为null，返回undefined

        //React17 自动从React的package中引入新的_jsx入口函数并调用jsx形成vdom 仍支持16的jsx 所以写jsx不需要再引入react
        //17当中react在做事件委托的时候将监听器挂载到根容器上（例如root）,不会和其他框架产生影响也方便后续的升级和维护
        //17对事件系统的修改，onscroll事件不在冒泡，onFocus和onBlur事件采用原生的focusin和focusout事件
        //捕获事件（如onClickCapture）使用的是浏览器中的捕获监听器
        //去除了事件池不需要调用e.persist()
        //useEffect变为异步清理副作用函数 ，由于进行异步处理，对于一些可变值的时候先在useEffect中进行存储
        //fiber标记优先级的expiration Time换成了lanes前者为普通数字后者为32位2进制数，计算更快而且可以标记多个优先级
function render(vnode,container){
    //vnode可能的节点类型有文本标签，原生标签，函数标签，类标签，fragment标签，逻辑标签provide consumer
    console.log("vnode",vnode,container)
    //1. vnode->node
    const node=createNode(vnode)
    //2. container.appendchild(node)
    container.appendChild(node)

}
function createNode(vnode){
    if(typeof vnode ==="number"){
        return document.createTextNode(vnode)
    }
    let node =null
    const {type} =vnode//获取vnode的节点类型
    if(typeof type ==="string"){
        //处理原生标签
        node =updateHostComponent(vnode)
    }else if(typeof type ==="function"){
        //函数组件或者类组件
        node=type.prototype.isReactComponent?//是否是类组件
        updateClassComponent(vnode)://处理类组件
        updateFunctionComponent(vnode)//处理函数组件
    }else{
        //处理fragment组件
        node=createFragmentComponent(vnode)
    }
    return node
}
function createFragmentComponent(vnode){
    //创建片段
    const node =document.createDocumentFragment()
    reconcileChildren(vnode.props.children,node)
    return node
}

//函数组件执行函数
function updateFunctionComponent(vnode){
    const {type,props} =vnode
    const vvnode =type(props)//执行函数并将参数传递下去 返回的是jsx处理完的vnode
    const node =createNode(vvnode)
    return node
}

//类组件先实例化 再执行render函数
function updateClassComponent(vnode){
    const {type,props} =vnode
    const instance =new type(props) //实例化类组件并将参数传递给Component类
    const vvnode=instance.render()  //获取jsx处理完的vnode
    const node=createNode(vvnode)
    return node
}
//处理原生标签
function updateHostComponent(vnode){
    const {type,props}  =vnode
    let node =document.createElement(type)
    //处理子节点
    if(typeof props.children ==="string"){
        //如果子节点是字符串说明是文本节点
        let childText =document.createTextNode(props.children)
        node.appendChild(childText)
    }else{
        //子节点是数组或者非文本节点
        reconcileChildren(props.children,node)
    }
    //处理属性
    updateNode(node,props)
    return node
}
//更新原生标签属性
function updateNode(node,props){
    Object.keys(props).filter(k=>k!=="children")
    .forEach(k=>{
        //可以扩展处理style
        node[k]=props[k]
    })
}
//处理非文本节点children
function reconcileChildren(children,container){
    if(Array.isArray(children)){
        //是数组遍历填充到container
        for(let index=0;index<children.length;index++){
            const child =children[index]
            render(child,container)
        }
    }else{
        //不是数组直接填充
        render(children,container)
    }
}
export default {render}