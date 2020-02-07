const http = require('http');
const server = http.createServer();
const Controller = require('./controller');

const controller = new Controller();

server.on("request", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // 解决前后端跨域问题 表示接受跨域请求，然后再进行请求转发
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === 'OPTIONS') {
        res.status = 200;
        res.end();
        return;
    }

    if (req.url == '/') {
        res.end('hello')
    }
    
    if (req.url == '/verify') {
        // res.end('verify');
        await controller.handleVerifyUpload(req, res) // 交给控制层验证 模块化
    }
});

server.listen(3000, () => {
    console.log("listening on port 3000");
})