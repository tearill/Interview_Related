const path = require('path'); // 引入node的path模块
const fse = require('fs-extra') // fs 扩展包
// 合并文件切片
// path.resolve() 把一个路径或路径片段的序列解析为一个绝对路径
const UPLOAD_DIR = path.resolve(__dirname, ".", "target"); // 上传的分片文件夹路径
// console.log(UPLOAD_DIR) // E:\Interview_Related\ByteDance\big_file_upload\server\target
const filename = 'yb'; // 合并出来的文件名
const filePath = path.resolve(UPLOAD_DIR, "..", `${filename}.jpeg`); // 要合并出来的图片文件路径
// console.log(filePath) // E:\Interview_Related\ByteDance\big_file_upload\server\yb.jpeg

const pipStream = (path, writeStream) => 
    new Promise(resolve => {
        const readStream = fse.createReadStream(path);
        readStream.on("end", () => {
            fse.unlinkSync(path); // 删除掉分块文件
            resolve();
        })
        readStream.pipe(writeStream);
    })
// 分块文件放在UPLOAD_DIR下 合并文件的路径是filepath 合并出来的文件名字是filename
const mergeFileChunk = async (filePath, filename, size) => {
    // console.log(filePath, filename, size)
    // 大文件上传时，设计的后端思想是，每个要上传的文件，先以文件名，为target目录名，把分文件blob，放进这个目录
    // 文件上传前要加上index
    // node 文件合并，stream
    const chunkDir = path.resolve(UPLOAD_DIR, filename); // 分片文件目录
    // console.log(chunkDir);
    const chunkPaths = await fse.readdir(chunkDir); // 取出分片目录下的所有文件(所有分片文件) [ 'yb-0', 'yb-1', 'yb-2' ]
    // console.log(chunkPaths)
    chunkPaths.sort((a, b) => a.split("-")[1]-b.split("-")[1]); // 把分片文件排序
    // console.log(chunkPaths, 'sort');
    // 每块内容写入最后的文件，promise
    await Promise.all(
        chunkPaths.map((chunkPath, index) => {
            pipStream(
                path.resolve(chunkDir, chunkPath), // 每一个分片文件路径
                fse.createWriteStream(filePath, {
                    start: index * size,
                    end: (index + 1) * size
                })
            )
        })
    )
    // console.log('文件合并成功');
    fse.rmdirSync(chunkDir); // 删除存放切片文件的文件夹
}

mergeFileChunk(filePath, filename, 0.5*1024*1024);