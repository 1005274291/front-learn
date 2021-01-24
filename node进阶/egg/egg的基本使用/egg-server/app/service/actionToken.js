const { Service } = require('egg')

class ActionTokenService extends Service {
    //将传过来的id进行签名再返回token
    async apply(_id) {
        const { ctx } = this
        return ctx.app.jwt.sign({
            data: {//将data签名完存储在ctx.state.user
                _id: _id
            },
            exp: Math.floor(Date.now() / 1000 + (60 * 60 * 7))
        }, ctx.app.config.jwt.secret)
    }

}
module.exports = ActionTokenService