//配置数据库连接配置项 key表示对应配置目标，model中存放数据模型
module.exports={
    db:{
        dialect:"mysql",
        host:"localhost",
        database:"开课吧",
        username:"root",
        password:"123456"
    },
    middleware:["logger"]//以数组的形式保证执行顺序,名称为middleware文件夹下的文件名
}