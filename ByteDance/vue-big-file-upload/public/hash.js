// 完成文件hash串的计算
// web worker
// self === this 表示当前的线程
// 通过内容计算 md5 值
self.importScripts("/spark-md5.min.js") // 基于库来实现计算

self.onmessage = e => { // 接受主线程传递过来的事件
    // self.postMessage({
    //     "msg": "你好"
    // })
    const { fileChunkList } = e.data; // 拿到传过来数据
    const spark = new self.SparkMD5.ArrayBuffer(); // 接受二进制文件缓冲
    let percentage = 0;
    let count = 0;
    // 计算出hash
    const loadNext = index => { // 拿到所有的内容
        const reader = new FileReader(); // 文件阅读对象 读取文件到内存
        reader.readAsArrayBuffer(fileChunkList[index].file); // 读取切片文件
        reader.onload = e => { // 加载成事件 读取文件的时候触发
            count++;
            spark.append(e.target.result);
            if (count === fileChunkList.length) { // 如果完成了
                self.postMessage({
                    percentage: 100,
                    hash: spark.end()
                });
                self.close(); // 关闭当前线程，回收内存，回到主线程
            } else {
                // 还没读完
                percentage += 100 / fileChunkList.length;
                self.postMessage({
                    percentage
                });
                loadNext(count)
            }
        }
    }
    loadNext(0)
}