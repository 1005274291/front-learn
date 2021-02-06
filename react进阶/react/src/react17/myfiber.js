//fiber 是react对虚拟dom的具体实现方式，是一个单链表的数据结构
//为什么需要fiber 对于大型项目组件树很大，递归遍历的成本会很高，主线程被持续占用，其他优先级高的任务无法被执行，造成卡顿
//fiber可以把渲染任务赋予优先级，设置超时时间，把渲染任务拆分成多块匀到多帧更加细粒度的执行任务
//由于是单链表的数据结构，可以设置指针，方便调度任务的暂停，终止和复用
//使用requestIdleCallback(callback,{options})  在浏览器空闲时间执行任务，不会影响关键事件，如动画和输入相应，callback接收IdleDeadline的参数可以获取当前的空闲时间和回调在是否超时时间执行的状态
//options可选 可以配置timeout属性设置超时时间，在超时时间没有执行回调会在下一个空闲时间强制执行


function render(vnode, container) {
    //定义根fiber(root节点)
    wipRoot = {
        stateNode: container,
        props: { children: vnode }
    }
    //第一个任务从根fiber开始
    nextUnitOfWork = wipRoot
    deletions=[]//初次渲染重置要删除的数组
}

//下一个要执行的fiber任务
let nextUnitOfWork = null
//wip work in progress 正在执行的fiber
let wipRoot = null //根fiber
let wipFiber = null //正在工作得fiber
let currentRoot = null //正在工作的根节点
let deletions=null //要删除的fiber节点
function workLoop(IdleDeadline) {
    //如果有下一个要执行的任务，并且有空闲时间
    while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
        //执行当前fiber，返回下一个fiber
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    }
    if (!nextUnitOfWork && wipRoot) {
        //如果没有当前任务了（fiber都计算完成），并且有要插入的容器（根节点）
        //提交任务
        commitRoot()
    }

    //初始化完成需要监听更新
    requestIdleCallback(workLoop)
}
function commitRoot() {
    deletions.forEach(commitWorker)//删除需要删除的节点之后进行新增和更新
    commitWorker(wipRoot.child)//提交根节点的子节点插入到根节点
    currentRoot = wipRoot //存储根节点  每次提交从根节点开始 源码中是会从当前的根节点开始提交
    wipRoot = null//将提交过的根节点置为空防止下次空闲时间继续计算
}
function commitWorker(workInProgress) {
    if (!workInProgress) {
        return
    }
    // 插入当前节点
    let parentNodeFiber = workInProgress.return
    while (!parentNodeFiber.stateNode) {
        //如果当前fiber的父节点没有真实dom例如函数组件类组件，就向上不断查找，直到找到有真实dom节点的父节点
        parentNodeFiber = parentNodeFiber.return
    }
    const parentNode = parentNodeFiber.stateNode
    if (workInProgress.effectTag=="placement" && workInProgress.stateNode) {
        //将当前节点的真实dom插入到父节点中（如果当前节点没有真实dom就插入子节点的dom和子节点兄弟节点的dom）
        parentNode.appendChild(workInProgress.stateNode)
    }else if(workInProgress.effectTag==="update" &&workInProgress.stateNode){
        updateNode(
            workInProgress.stateNode,
            workInProgress.base.props,
            workInProgress.props
        )
    }else if(workInProgress.effectTag==="deletion"){
        commitDeletions(workInProgress,parentNode)
    }
    // 插入当前节点的子节点
    commitWorker(workInProgress.child)
    // 插入当前节点的兄弟节点
    commitWorker(workInProgress.sibling)
}

function commitDeletions(workInProgress,parentNode){
    if(workInProgress.stateNode){
        parentNode.removeChild(workInProgress.stateNode)
    }else{
        commitDeletions(workInProgress.child,parentNode)
    }
}

//fiber结构 child 第一个子节点 sibling 下一个兄弟 return 爸爸 stateNode dom节点
function performUnitOfWork(workInProgress) {
    //执行当前fiber并向下构建fiber节点
    const { type } = workInProgress
    if (typeof type === 'function') {
        //函数标签
        type.prototype.isReactComponent
            ? updateClassComponent(workInProgress)
            : updateFunctionComponent(workInProgress)
    } else {
        //原生标签
        updateHostComponent(workInProgress)
    }


    //返回下一个fiber
    //先找子节点
    if (workInProgress.child) {
        return workInProgress.child
    }
    //没有子节点，传给兄弟
    //没有兄弟向上找父节点的兄弟
    let nextFiber = workInProgress
    while (nextFiber) {
        if (nextFiber.sibling) {
            //如果有兄弟节点去找兄弟节点
            return nextFiber.sibling
        }
        //递归去找父亲的兄弟节点
        nextFiber = nextFiber.return
    }
}
//处理原生组件
function updateHostComponent(workInProgress) {
    if (!workInProgress.stateNode) {
        //如果当前fiber节点没有dom节点,创建dom节点,只有原生组件的fiber有stateNode
        workInProgress.stateNode = createNode(workInProgress)
    }
    //协调子节点(将子节点插入当前节点)
    reconcileChildren(workInProgress, workInProgress.props.children)
}
//处理函数组件
function updateFunctionComponent(workInProgress) {
    wipFiber = workInProgress//正在工作的fiber
    wipFiber.hooks = []//初始化正在工作函数fiber的hooks
    wipFiber.hookIndex = 0//初始化正在工作fiber的索引

    //函数组件fiber节点的子节点是它的返回值
    const { type, props } = workInProgress
    const children = type(props)//执行函数 得到新的children
    reconcileChildren(workInProgress, children)
}
//处理类组件
function updateClassComponent(workInProgress) {
    const { type, props } = workInProgress
    const instance = new type(props)
    //类组件的fiber节点的子节点是它的实例render返回值
    const children = instance.render()
    reconcileChildren(workInProgress, children)
}
function reconcileChildren(workInProgress, children) {
    if (!(workInProgress.props && typeof workInProgress.props.children !== "string")) {
        return //如果children是文本节点不需要协调，在updateNode中处理就好
    }
    //全部转换成数组方便处理
    let newChildren = Array.isArray(children) ? children : [children]
    //记录上一个遍历到的节点
    let previousNewFiber = null
    //遍历子节点
    let oldFiber = workInProgress.base && workInProgress.base.child//获取老节点的第一个子节点
    // console.log(oldFiber,"oldfiber")
    for (let index = 0; index < newChildren.length; index++) {
        const child = newChildren[index]
        const same = child && oldFiber && child.type == oldFiber.type //源码中是key和tag来认为是相同节点的
        let newFiber = null
        if (same) {
            //认为是相同节点 更新节点
            newFiber = {
                type: oldFiber.type,
                props: child.props,
                child: null,
                sibling: null,
                return: workInProgress,
                stateNode: oldFiber.stateNode,
                base: oldFiber,
                effectTag: "update"
            }
        }
        if (!same && child) {
            //不是相同节点 新增插入
            //为子节点创建fiber架构
            newFiber = {
                type: child.type,//默认vnode的type
                props: child.props,//默认vnode的props
                child: null,//子节点的第一个子节点还不知道
                sibling: null,//子节点的兄弟节点还不知道
                return: workInProgress,//子节点的父节点就是自己
                stateNode: null,//子节点的真实dom在当子节点进入updateHostComponent()的时候赋值
                base: null,//上一次的fiber
                effectTag: "placement"//新增插入
            }
        }
        if (!same && oldFiber) {
            //删除
            oldFiber.effectTag = "deletion"
            deletions.push(oldFiber)
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling//现在的oldfiber指向的是老父节点的第一个子节点，遍历完需要指向老节点的下一个子节点
        }
        //开始构建
        if (index === 0) {
            //当前节点的第一个子节点
            workInProgress.child = newFiber
        } else {
            //当前节点的非第一个子节点
            //上一个遍历到的子节点的兄弟节点就是当前子节点
            previousNewFiber.sibling = newFiber
        }
        //遍历完当前节点把它赋值给上一节点
        previousNewFiber = newFiber
    }
}
function createNode(workInProgress) {
    //当前是没有转化成fiber之前的vnode
    let node = null
    const { type, props } = workInProgress
    if (typeof type === "string") {
        //原生标签
        node = document.createElement(type)
    }
    //更新属性
    updateNode(node, {},props)
    return node
}
function updateNode(node, preprops, props) {
    //先将旧属性移除再新增新属性
    Object.keys(preprops).forEach(k => {
        if (k === "children") {
            //如果子节点是文本节点,将插入到标签中，如果不是文本节点会在reconcileChildren处理，但最后一层都会是文本节点
            if (typeof props.children === "string") {
                node.innerHTML = ""
            }
        } else {
            if (k.slice(0, 2) === "on") {
                //处理事件，源码当中用到了事件委托16挂载到document，17挂载到根节点
                //会把props在映射表中查找，找到进行事件委托
                let eventName = k.slice(2).toLowerCase()
                node.removeEventListener(eventName, props[k])
            } else {
                //普通属性直接传递
                if (!(k in props)) {
                    node[k] = ""
                }
            }

        }
    })
    Object.keys(props).forEach(k => {
        if (k === "children") {
            if(typeof props.children==="string"){
                node.innerHTML=props.children
            }
        }else{
            if(k.slice(0,2) ==="on"){
                //添加事件
                let eventName = k.slice(2).toLowerCase()
                node.addEventListener(eventName, props[k])
            }else{
                node[k]=props[k]
            }
        }
    })
}
//在浏览器空闲时间开始调度任务
requestIdleCallback(workLoop)

// hook:{
//     state 存储状态
//     queue 存储批量更新的状态
// }

export function useState(init) {
    // base是上一次的fiber，通过是否存在base来判断是初次渲染还是更新
    const oldHook = wipFiber.base && wipFiber.base.hooks[wipFiber.hookIndex]
    const hook = oldHook ? {
        state: oldHook.state,
        queue: oldHook.queue
    } : {
            state: init,
            queue: []
        }
    hook.queue.forEach(action => {
        //模拟源码的批量更新
        hook.state = action
    })
    hook.queue=[]
    const setState = (action) => {
        hook.queue.push(action)//把参数推入待更新的数组 然后重新计算fiber到函数组件的时候会执行usestate会调用hookqueue进行批量更新
        //创建一个要更新的fiber 从根节点开始更新
        wipRoot = {
            stateNode: currentRoot.stateNode,
            type: currentRoot.type,//使用hook的一定是函数组件
            props: currentRoot.props,
            base: currentRoot//每次更新的时候把上一次的根fiber传过来，方便diff
        }
        nextUnitOfWork = wipRoot//赋值下一次要执行的fiber
        deletions=[]//每次更新重置要删除的数组
    }
    wipFiber.hooks.push(hook)//将当前hook注册进函数fiber
    wipFiber.hookIndex++ //索引++
    return [hook.state, setState]
}
export default { render }