//egg的分层结构主要是为了，对于不同的接口的处理函数controller可能会存在逻辑的复用
//就可以把这些逻辑的复用抽出一层service层
//而对于不同的service层可能会对同样的数据表进行同样的操作
//所以分离出了dao层（model层）service层可以调用model中的模型方法，借用sequelize
//router=>controller=》service=》model  egg实现了三层结构+约定优于定义（只要你定义了会自动加载无需引入）