var cluster = require('cluster');
var os = require('os'); // 获取CPU 的数量
var numCPUs = os.cpus().length;

// numCPUs = 2
var process = require('process')

var workers = {};
if (cluster.isMaster) {
    // 主进程分支
    cluster.on('exit', (worker, code, signal) => {
        console.log('工作进程 %d 关闭 (%s). 重启中...',
            worker.process.pid, signal || code);//退出时的终端信号和退出码
        delete workers[worker.process.pid]
        worker = cluster.fork()
        workers[worker.process.pid] = worker
    });

    console.log('numCPUs:', numCPUs)
    for (var i = 0; i < numCPUs; i++) {
        var worker = cluster.fork();//以子进程的形式执行cluster.js
        console.log('init ... pid', worker.process.pid)//进程号
        workers[worker.process.pid] = worker;
    }
} else {
    //子进程分支
    var app = require('./app');
    app.listen(3000);
}
// 当主进程被终止时，关闭所有工作进程
process.on('SIGTERM', function () {
    for (var pid in workers) {
        process.kill(pid);
    }
    process.exit(0);
});
require('./test')


//nodejs在底层设置了如果是用cluster启动的话可以监听同一个端口