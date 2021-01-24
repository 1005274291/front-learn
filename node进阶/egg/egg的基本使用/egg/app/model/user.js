module.exports = app => {//model主要是将数据库操作抽离出来，创建模型，并将模型和方法挂在ctx上
    const { STRING } = app.Sequelize;
    //app.model就是db对象
    const User = app.model.define(
      "user",
      { name: STRING(30) },
      { timestamps: false }
    );
  
    // 数据库同步
    //true时会删除原有表重建新表，，为false时不会删除原有表,只创建不存在的
    User.sync({force: false})
  
    return User;
  };