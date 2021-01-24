const http = require('http')
const server = http.createServer((request, response) => {
    Math.random() > 0.5 ? aa() : '2'     
    response.end('Hello ')
})

if (!module.parent) {
    //主模块的情况 node app.js
    server.listen(3000);
    console.log('app started at port 3000...');
} else {
    //非主模块 require(app)
    module.exports = server
}



//node的高效高并发，主要是因为
//解决了故障修复，多核利用，多进程共享端口（cluster）