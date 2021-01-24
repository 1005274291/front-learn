
const router = require('koa-router')()
const { link } = require('fs')
const {
    init,list, get, create, update, del,
} = require('./api')
//采用中间件
//接收到请求，通过占位符获取模型名称，根据模型名称把模型挂到全局再由后面的对应操作调用
router.get("/api/:list/:id",init,get)
router.get('/api/:list', init, list)
router.post('/api/:list', init,create)
router.put('/api/:list/:id', init, update)
router.delete('/api/:list/:id', init, del)

module.exports = router.routes()