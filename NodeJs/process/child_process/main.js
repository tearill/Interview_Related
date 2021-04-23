// - 大文件上传 web-worker 创建新线程 计算hash 
const http = require('http');
const fork = require('child_process').fork; // 创建新的进程

http.createServer((req, res) => {
    const compute = fork('./fork_compute.js'); // 开启子进程 类似web-worker
    // const sum = longComputation();
    compute.send('开启一个新的进程');
    compute.on('message', sum => {
        res.end(`sum = ${sum}`)
    })
}).listen(1314, () => {
    console.log(process.pid)
});