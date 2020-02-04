const http = require('http');
const path = require('path');
const multiparty = require('multiparty');
const fse = require('fs-extra');
const server = http.createServer();
const UPLOAD_DIR = path.resolve(__dirname, '.', "target");

server.on("request", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end("hello");

    if (req.url == '/') {
        // chunk, name
        const multipart = new multiparty.Form();
        // console.log(multipart);
        multipart.parse(req, async (err, fields, files) => {
            if (err) {
                return;
            }
            // console.log(files);
            const [chunk] = files.chunk; // 拿到文件块
            const [filename] = fields.filename; // 切片文件完整文件名
            // console.log(filename);
            const dir_name = filename.split('-')[0]; // 切片文件名字前缀 > 切片文件文件夹名
            const chunkDir = path.resolve(UPLOAD_DIR, dir_name); // 切片文件存放文件夹
            // console.log(chunkDir);
            if (!fse.existsSync(chunkDir)) {
                await fse.mkdirs(chunkDir); // 创建切片文件文件夹
            }
            // chunk.path
            // console.log(chunk.path);
            await fse.move(chunk.path, `${chunkDir}/${filename}`); // 把切片文件放进文件夹
        })
    } else if (req.url == '/merge') {
        res.end('OK');
    }
});

server.listen(3000, () => console.log("listening on port 3000"))