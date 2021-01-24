const Service = require('egg').Service
//Service主要是复用业务逻辑，一般由controller调用，挂载在ctx上，继承自egg的Service类
class UserService extends Service {
    async getAll() {
        // return [
        //     { name: 'jerry' }
        // ]

        let nameArr= await this.ctx.model.User.findAll()
        console.log(nameArr)
        return nameArr[0].dataValues.name
    }
}
module.exports = UserService