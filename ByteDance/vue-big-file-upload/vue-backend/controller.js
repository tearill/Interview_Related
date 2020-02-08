// 验证上传
const path = require('path');
const fse = require('fs-extra');
const multiparty = require('multiparty'); // 用来解析formdata
const UPLOAD_DIR = path.resolve(__dirname, '..', 'target') // 上传到的位置

const extractExt = filename =>  // 拿到文件的后缀名
    filename.slice(filename.lastIndexOf("."), filename.length); // 从最后一个 . 开始剪切到最后

const resolvePost = req => // 拿到post过来的数据
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

const pipeStream = (path, writeStream) =>
    new Promise(resolve => {
        const readStream = fse.createReadStream(path);
        readStream.on('end', () => {
            // fse.unlinkSync(path);
            resolve();
        });
        readStream.pipe(writeStream);
    })

// 合并后文件放置的路径是filePath 切片文件放在UPLOAD_DIR下的fileHash文件夹下 size是每块切片文件的大小
const mergeFileChunk = async (filePath, fileHash, size) => {
    const chunkDir = path.resolve(UPLOAD_DIR, fileHash); // 切片文件所在的文件夹
    const chunkPaths = await fse.readdir(chunkDir); // 读出目录下的所有文件
    chunkPaths.sort((a, b) => a.split("-")[1] - b.split("-")[1]); // 分片排序
    await Promise.all(
        chunkPaths.map((chunkPath, index) => {
            pipeStream(
                path.resolve(chunkDir, chunkPath),
                // 指定位置创建可写流
                fse.createWriteStream(filePath, {
                    start: index * size,
                    end: (index + 1) * size
                })
            )
        })
    );
    // fse.rmdirSync(chunkDir); // 合并后删除保存切片的目录
}

// 返回已经上传切片名
const createUploadedList = async fileHash =>
    fse.existsSync(path.resolve(UPLOAD_DIR, fileHash))
        ? await fse.readdir(path.resolve(UPLOAD_DIR, fileHash))
        : [];


// 匿名类
module.exports = class {
    async handleVerifyUpload(req, res) { // 验证服务器是否有用户想要上传的文件
        // res.end('verify');
        // 判断服务器端有没有这个文件
        const data = await resolvePost(req); // 拿到 post 传过来的 data，bodyParser
        const { fileHash, filename } = data; // 从data中把hash值和文件名解构出来
        const ext = extractExt(filename); // 拿出文件后缀
        // yb.jpeg
        console.log(ext);  // .jpeg
        const filePath = path.resolve(UPLOAD_DIR, filename); // 查找上传的文件在服务器端上的位置
        console.log(filePath); // E:\Interview_Related\ByteDance\vue-big-file-upload\target\24b42dbd786fbd1bcdac21be9c77de70.jpeg
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
                    uploadedList: await createUploadedList(fileHash)
                })
            )
        }
    }

    async handleFormData(req, res) { // 上传文件并处理文件
        // 带有文件上传的表单
        const multipart = new multiparty.Form(); // 拿到post过来的表单数据formdata
        // err是发生错误时，返回的异常信息。fields是一个对象，存储着FormData里的字段信息。files存储的是文件信息。
        multipart.parse(req, async (err, fields, files) => {
            if (err) {
                console.error(err);
                res.status = 500;
                res.end("process file chunk failed");
                return;
            }

            const [chunk] = files.chunk; // 拿到文件块
            const [hash] = fields.hash; // 单个切片文件的hash
            const [fileHash] = fields.fileHash; // 整个文件的hash
            const [filename] = fields.filename; // 切片文件完整文件名
            // console.log(chunk, hash, fileHash, filename);
            const filePath = path.resolve(UPLOAD_DIR, filename); // 合并后的文件
            console.log(filePath);
            const chunkDir = path.resolve(UPLOAD_DIR, fileHash); // 上传到的文件夹
            console.log(fse.existsSync(filePath));
            if (fse.existsSync(filePath)) { // 上传过
                res.end('file exist');
                return;
            }

            if (!fse.existsSync(UPLOAD_DIR)) {
                await fse.mkdirs(UPLOAD_DIR);
            }

            if (!fse.existsSync(chunkDir)) {
                // 如果目录地址不存在
                await fse.mkdirs(chunkDir);
            }
            // 从服务器端暂存位置移到上传目录下自己的那个文件夹下
            await fse.move(chunk.path, path.resolve(chunkDir, hash));
            res.end("received file chunk");
        })
    }

    async handleMerge(req, res) { // 合并文件请求
        const data = await resolvePost(req); // 拿到post过来的数据
        const { fileHash, filename, size } = data; // 解构
        // const ext = extractExt(filename); // 拿到文件后缀名
        const filePath = path.resolve(UPLOAD_DIR, filename); // 合并后文件要放置的位置
        console.log(filePath, "+++");
        await mergeFileChunk(filePath, fileHash, size);
        res.end(
            JSON.stringify({
                code: 0,
                message: "file merged success"
            })
        )
    }
}