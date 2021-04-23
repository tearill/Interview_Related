// 开启后端服务器
const http = require('http');
const server = http.createServer();
const Controller = require('./controller');

const controller = new Controller();

server.on("request", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // 解决前后端跨域问题 表示接受跨域请求，然后再进行请求转发
    res.setHeader("Access-Control-Allow-Headers", "*");

    // 每次请求接口都会有两个请求，先发送一个OPTIONS请求
    if (req.method === 'OPTIONS') { // 跨域非简单请求时浏览器先会请求服务器验证一下，这个请求成功返回浏览器才会允许跨域
        res.status = 200;
        res.end();
        return;
    }
    // 配置路由 
    if (req.url == '/verify') { // 上传验证
        // res.end('verify');
        await controller.handleVerifyUpload(req, res); // 交给控制层验证 模块化
    }

    if (req.url == '/') { // 上传切片并处理
        // res.end('hello')
        // 上传切片处理 
        await controller.handleFormData(req, res);
    }
    
    if (req.url == '/merge') { // 合并切片
        await controller.handleMerge(req, res);
        return;
    }   
});

server.listen(3000, () => {
    console.log("listening on port 3000");
})