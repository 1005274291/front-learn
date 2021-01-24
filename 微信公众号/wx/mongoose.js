const mongoose = require('mongoose')
const {Schema}=mongoose
mongoose.connect('mongodb://localhost:27017/kaikeba', {
    useNewUrlParser: true
}, () => {
    console.log('Mongodb connected..')
})

//微信服务端token 用于像微信服务器获取关注者信息
exports.ServerToken = mongoose.model('ServerToken', {
    accessToken: String
});

//客户端token 用于向服务器获取用户信息

const schema=new Schema({
    access_token: String,
    expires_in: Number,
    refresh_token: String,
    openid: String,
    scope: String,
    create_at: String
})
//自定义方法
schema.statics.getToken=async function (openid){
    return await this.findOne({
        openid
    })
}
schema.statics.setToken=async function(openid,token){
    const query={
        openid
    }
    const options={
        upsert:true
    }
    return await this.updateOne(query,token,options)
}

exports.ClientToken =mongoose.model("ClientToken",schema)


