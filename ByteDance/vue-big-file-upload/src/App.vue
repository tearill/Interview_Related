<template>
  <div id="app">
    <div>
      <input type="file" @change="handleFileChange" />
      <el-button @click="handleUpload">上传</el-button>
    </div>
    <div>
      <div>计算文件的hash</div>
      <el-progress :percentage="hashPercentage"></el-progress>
    </div>
  </div>
</template>

<script>
// 良好的代码风格 enumarable
const Status = {
  // 把可枚举的类型单独作为一个对象 做到一改全改 代码可读性高
  wait: "wait",
  pause: "pause",
  uploading: "uploading"
};
const SIZE = 0.5 * 1024 * 1024;

export default {
  name: "app",
  data: () => ({
    container: {
      // 将任务放到一起
      file: null,
      hash: "" // 哈希
    },
    status: Status.wait,
    hashPercentage: 0
  }),
  methods: {
    request({ // 请求封装
      url,
      method = "POST",
      data,
      headers = {},
      requestList // 上传的文件列表
    }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest(); // js ajax 对象
        xhr.open(method, url); // 打开某个url的请求
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]); // 如果传了请求头进来 给请求加头信息
        });
        xhr.send(data); // 发送数据
        xhr.onload = e => {
          resolve({
            data: e.target.response // 服务器端返回的数据
          });
        };
      });
    },

    // ES6的特性，你和代码是如何结合的？赋初值，少传这个参数
    createFileChunk(file, size = SIZE) { // 创建文件切片
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({
          // 文件切片
          file: file.slice(cur, cur + size)
        });
        cur += size;
      }
      return fileChunkList;
    },

    calculateHash(fileChunkList) { // 根据内容计算文件hash串
      return new Promise(resolve => {
        // 封装花时间的任务
        // html5 带来的优化 web workers
        // js是单线程的语言，UI是主线程
        // html5 web workers 单独的开一个线程，独立的，做完之后回调主线程，不会影响原来的UI
        this.container.worker = new Worker("/hash.js"); // 启动新的线程
        this.container.worker.postMessage({ fileChunkList }); // 向线程分派任务并传输参数
        this.container.worker.onmessage = e => {
          // 等待计算完成之后执行的回调
          // console.log(e.data);
          const { percentage, hash } = e.data;
          this.hashPercentage = percentage;
          console.log(percentage);
          if (hash) {
            resolve(hash);
          }
        };
      });
    },

    handleFileChange(e) {
      // console.log(e.target.files);
      // 做文件的分割 slice
      const [file] = e.target.files; // 拿到第一个文件
      this.container.file = file;
    },

    async handleUpload() { // 处理上传
      // 大量的任务
      if (!this.container.file) return;
      this.status = Status.uploading;
      // 创建文件切片
      const fileChunkList = this.createFileChunk(this.container.file);
      console.log(fileChunkList); // 切片文件
      this.container.hash = await this.calculateHash(fileChunkList); // 计算hash串
      // 文件内容相同 hash值是一样的 没必要重复上传同一个文件
      const { shouldUpload, uploadedList } = await this.verifyUpload(
        // 把文件名和计算出来的hash值交给后端去验证是否上传过
        this.container.file.name,
        this.container.hash
      );
      console.log(shouldUpload, uploadedList)
    },

    async verifyUpload(filename, fileHash) { // 上传验证hash，是否应该上传
      const { data } = await this.request({
        url: "http://localhost:3000/verify", // 服务器端
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({ // 字符串化(传过来的是二进制流)
          filename,
          fileHash
        })
      });
      return JSON.parse(data); // 字符串转回成JSON格式
    },
    
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
