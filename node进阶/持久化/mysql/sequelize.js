//orm 采用数据库中间件
(async ()=>{
    const Sequelize =require("sequelize")
    //建立连接
    const seqelize=new Sequelize("开课吧","root","123456",{
        host:'localhost',
        dialect:"mysql",//sql方言
        operatorsAliases:false//可不可以通过map的方式使用运算符 防止有警告
    })
    //定义模型 
    const Fruit=seqelize.define('Fruit',{
        //配置自定义id 不适用自增的主键而使用uuid
        id:{
            type:Sequelize.DataTypes.UUID,
            defaultValue:Sequelize.DataTypes.UUIDV1,
            primaryKey:true
        },
        name:{type:Sequelize.STRING(20),allowNull:false},
        price:{type:Sequelize.FLOAT,allowNull:false},
        stock:{type:Sequelize.INTEGER,defaultValue:0}
    },{
        tableName:"TBL_FRUIT"//设置表名
    })
    let ret =await Fruit.sync({
        force:true//强制同步
    })//将模型和数据库同步，同时创建表，以后操作Fruit对象相当于操作数据库

    //新增数据
    ret=await Fruit.create({
        name:"芒果",
        price:3.5
    })
    console.log("create",ret)

    //查询数据
    //获取操作符 
    const Op=Sequelize.Op
    ret =await Fruit.findAll({
        //查找选用的是json格式
        where:{
            price:{[Op.lt]:4,[Op.gt]:3},//大于3小于4的price
        }
    })
    console.log("findAll",JSON.stringify(ret,"","\t"))//把空格格式化为缩进
})()