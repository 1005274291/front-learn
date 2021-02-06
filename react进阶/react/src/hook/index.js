// 基础hook
// useState({})创建state
// useEffect(()=>{},[])生命周期函数 挂载，更新（依赖项），卸载执行（异步 dom更新后有延迟）
// useContext(context)获取上下文 

// 额外的Hook
// useReducer()  创建reducer
// const expensive= useCallback(()=>{},[count]) 缓存函数  当把expensive传入到子组件，由于传递的是函数会导致子组件比较expensive为不同导致更新，usecallback就会导致传下去的expensive是一个不会更新
// const expensive= useMemo(()=>{},[count]) 缓存函数的返回值 只有count改变才会从新计算变量
// useRef()  创建一个节点的引用
// useImperativeHandle(ref,{}) 将实例暴露给父组件
// useLayoutEffect dom更新完立即执行（同步）

//在类组件Component中挂了一个updater,setstate时会调用实例上updater中的enqueueSetState()方法去队去进行批量更新，如果setState传入的是对象只取最后一个值，如果传入的是函数则会链式调用函数
//再调用enqueueUpdate（将update入队列）=>scheduleUpdateOnFiber(current,lane,eventTime)处理更新=》定时器（在合成事件时赋值executionContext，由于异步又归0）和原生事件（在合成事件表中找不到所以executionContext为0）是同步，其他异步实现了事件委托
//forceupdate也一样多了一个createUpdate()

//hook是运行在fiber中的，，在执行函数时注册，并记录当前根节点，setstate会新创建fiber从当前根节点开始更新
//fiber中的flags相当于我们写的effectTag  标记节点该怎么去处理（更新替换删除等） 都是二进制方便互相组合
//fiber中的tag相当于我们写的type 标记节点的具体类型（函数类组件等） 都是二进制
//render会根据是否有曾经的根节点来判断是更新还是初次渲染 ，然后都会调用updateContainer=》通过createUpdate创建一个更新（有lane一个二进制优先级，payload参数，回调，包括setState，forceupdate）=》enqueueUpdate（将update入队列）
//=>scheduleUpdateOnFiber(current,lane,eventTime)处理更新
//先检查当前上下文的处理环境 executionContext是否满足更新条件，初次render会走performSyncWorkOnRoot(root)=>renderRootSync=>workLoopSync进入循环执行fiber
//=》beginwork处理fiber next接收下一个要处理的fiber=》比较current（当前渲染到页面上的元素）如果存在就走更新逻辑（根据props和context决定是否更新oldprops存在memoizedProps上，newProps存在pendingProps上），不存在就走初次渲染逻辑 根据tag进行不同的处理 profile是记录性能时间
//函数和类组件都是执行一下构造函数，statenode存储的是实例，在实例上挂update，
//挂载组件执行生命周期 在componentwillMount后执行UpdateQueue()进行异步批量更新 协调子节点reconcileChildren
//链表diff时是旧fiber和新的children进行diff 所以设置lastPlacedIndex记录上次插入的位置（拿新节点去旧链表找相同节点（找一个删一个，删到最后剩余的是多余的老节点全部删除），找到的节点在fiber上标记（插入和更新等），用新的子节点的属性）
//为了方便删除节点，，构建一个map图{key:fiber} 可以通过set和delete 增删节点  key是用户设置的key，没有设置的话是index


//提交commitRoot 根据优先级执行commitRootImpl() 根据fiber的flags进行更新