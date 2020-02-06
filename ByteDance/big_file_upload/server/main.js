// 后端 处理提交
const http = require('http');
const path = require('path');
const multiparty = require('multiparty'); // 用来解析formdata
const fse = require('fs-extra');
const server = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, '.', "target");

server.on("request", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // 解决前后端跨域问题 表示接受跨域请求，然后再进行请求转发
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end("hello");

    if (req.url == '/') {
        // chunk, name
        const multipart = new multiparty.Form(); // 拿到post过来的表单数据formdata
        // console.log(multipart);
        // err是发生错误时，返回的异常信息。fields是一个对象，存储着FormData里的字段信息。files存储的是文件信息。
        multipart.parse(req, async (err, fields, files) => { // 利用parse()方法来解析formdata
            if (err) {
                return;
            }
            // console.log(files);
            const [chunk] = files.chunk; // 拿到文件块 chunk为前端formdata里面设置的key
            const [filename] = fields.filename; // 切片文件完整文件名 filename为前端formdata里面设置的key
            // console.log(filename);
            const dir_name = filename.split('-')[0]; // 切片文件名字前缀 => 切片文件文件夹名
            const chunkDir = path.resolve(UPLOAD_DIR, dir_name); // 切片文件所在文件夹的路径
            // console.log(chunkDir);
            if (!fse.existsSync(chunkDir)) {
                await fse.mkdirs(chunkDir); // 创建切片文件文件夹
            }
            // chunk.path
            // console.log(chunk.path); // 文件上传到服务器零时存储位置
            await fse.move(chunk.path, `${chunkDir}/${filename}`); // 把切片文件放进文件夹
        })
    } else if (req.url == '/merge') {
        res.end('OK');
    }
});

server.listen(3000, () => console.log("listening on port 3000"))