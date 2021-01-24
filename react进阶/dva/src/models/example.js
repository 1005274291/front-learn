
export default {

  namespace: 'example',//example的命名空间，在页面访问models中的数据需要指定它的命名空间

  state: {},

  subscriptions: {
    // 在app.start()时调用，用于订阅数据源并筛选自己的需要修改的数据进行dispatch，返回一个取消订阅的方法在unmodel的时候执行
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    //副作用函数集合，在页面通过connect关联，通过dispatch({type:fetch,payload:{name:user}})触发
    *fetch({ payload }, { call, put }) {  // eslint-disable-line
      //通过call调用副作用函数（请求后端接口）
      yield put({ type: 'save' });//发送真正的dispatch
    },
  },

  reducers: {
    //定义修改规则，接受action改变state
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },

};
