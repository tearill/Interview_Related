// 验证上传
const path = require('path');
const fse = require('fs-extra');

const UPLOAD_DIR = path.resolve(__dirname, '..', 'target') // 上传文件的文件夹

const extractExt = filename =>  // 拿到文件的后缀名
    filename.slice(filename.lastIndexOf("."), filename.length); // 从最后一个 . 开始剪切到最后

const resolvePost = req =>
    new Promise(resolve => {
        // post 数据是慢慢的来的
        let chunk = "";
        req.on("data", data => { // 正在上传
            chunk += data; // 二进制流
        })
        req.on("end", () => { // 上传完成
            console.log("end", chunk) // end {"filename":"yb.jpeg","fileHash":"24b42dbd786fbd1bcdac21be9c77de70"}
            resolve(JSON.parse(chunk)); // 转换回JSON对象
        })
    })

// 匿名类
module.exports = class {
    async handleVerifyUpload(req, res) {
        // res.end('verify');
        // 判断服务器端有没有这个文件
        const data = await resolvePost(req); // 拿到 post 传过来的 data，bodyParser
        const { fileHash, filename} = data; // 从data中把hash值和文件名解构出来
        const ext = extractExt(filename); // 拿出文件后缀
        // yb.jpeg
        console.log(ext);  // .jpeg
        const filePath = path.resolve(UPLOAD_DIR, `${fileHash}${ext}`); // 根据hash值查找上传的文件在服务器端上的位置
        console.log(filePath);
        if (fse.existsSync(filePath)) {
            res.end( // 文件已经存在 不需要上传
                JSON.stringify({
                    shouldUpload: false
                })
            )
        } else {
            res.end( // 文件不存在 要上传
                JSON.stringify({
                    shouldUpload: true,
                    uploadedList: []
                })
            )
        }
    }
}