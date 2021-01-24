+ 事件处理
    * 原生事件监听 platforms/web/runtime/modules/events.js
        + 事件也是作为属性处理
        + 整体流程：patch()=>createElm()递归创建子节点=>invodeCreateHooks()调用节点生命周期=>updateDOMListener()
    * 自定义事件监听 core/instance/events.js
        + 整体流程：patch()=>createElm()=>createComponent()创建组件=>hook.init()处理属性=>createComponentInstance..=>_init()=>initEvents()=>updateComponentListener()
        + 事件监听和派发者均是组件实例，自定义组件中一定伴随着原生事件的监听与处理
+ v-model双向绑定
    * 原生标签双向绑定，自定义指令，对于input/select/radio/ckeckbox等有不同的监听和处理 
    * 自定义组件双向绑定 model选项会生成on 默认绑定dom的value和监听dom的input事件，如果同时实现v-model和@input会将两个回调函数同时合并，
    在子组件emit时顺序触发