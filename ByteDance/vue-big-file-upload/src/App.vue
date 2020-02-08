<template>
  <div id="app">
    <div>
      <input type="file" @change="handleFileChange" />
      <el-button @click="handleUpload">上传</el-button>
      <el-button @click="handleResume">恢复</el-button>
      <el-button @click="handlePause">暂停</el-button>
    </div>
    <div>
      <div>计算文件的hash</div>
      <el-progress :percentage="hashPercentage"></el-progress>
      <div>总进度</div>
      <!-- 每个blob进度 计算出来
      1. 每块blob上传 值 percentage 会变，watch
      2. 计算属性 computed -->
      <el-progress :percentage="fackUploadPercentage"></el-progress>
    </div>
    <!-- 多个切片 -->
    <el-table :data="data">
      <el-table-column prop="hash" label="切片hash" align="center"></el-table-column>
      <el-table-column label="大小(kb)" align="center" width="120">
        <template v-slot="{row}">
          {{row.size | transformByte}}
        </template>
      </el-table-column>
      <el-table-column label="进度" align="center">
        <template v-slot="{row}">
          <el-progress :percentage="row.percentage" color="#909399"></el-progress>
        </template>
      </el-table-column>
    </el-table>
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
const SIZE = 10 * 1024 * 1024;

export default {
  name: "app",
  filters: {
    transformByte(val) {
      return Number((val/1024).toFixed(0));
    }
  },
  computed: {
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map(item => item.size * item.percentage) // 每个blob的已上传大小
        .reduce((acc, cur) => acc + cur) // 已上传的总文件大小
      return parseInt((loaded / this.container.file.size).toFixed(2));
    }
  },
  watch: {
    uploadPercentage(now) { // 监听文件改变 now 代表新的值 有变化
      if (now > this.fackUploadPercentage) { 
        this.fackUploadPercentage = now;
      }
    }
  },
  data: () => ({
    fackUploadPercentage: 0,
    container: { // 每一个切片的容器
      // 将任务放到一起
      file: null,
      hash: "" // 哈希
    },
    status: Status.wait,
    hashPercentage: 0, // hash的计算进度
    data: [], // 要上传的文件数据
    requestList: [] // xhr 数组
  }),
  methods: {
    request({ // 请求封装
      url,
      method = "POST",
      data,
      onProgress = e => e,
      headers = {},
      requestList // 上传的文件列表
    }) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest(); // js ajax 对象
        xhr.open(method, url); // 打开某个url的请求
        xhr.upload.onprogress = onProgress; // 上传过程中调用onProgress
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]); // 如果传了请求头进来 给请求加头信息
        });
        xhr.send(data); // 发送数据
        xhr.onload = e => {
          console.log(e.target.response, "++++");
          if (requestList) {
            // xhr使命完成了 该切片上传完成
            const xhrIndex = requestList.findIndex(item => item === xhr); // 查找到该完成了的xhr的下标
            requestList.splice(xhrIndex, 1); // 将查找到的xhr对象移除
          }
          resolve({
            data: e.target.response // 服务器端返回的数据
          });
        };
        if (requestList) {
          requestList.push(xhr); // 每个请求
          console.log(requestList);
        }
      });
    },

    // ES6的特性，你和代码是如何结合的？赋初值，少传这个参数
    createFileChunk(file, size = SIZE) { // 创建文件切片
      const fileChunkList = []; // 文件切片数组
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({
          // 将文件切片
          file: file.slice(cur, cur + size)
        });
        cur += size;
      }
      return fileChunkList;
    },

    async calculateHash(fileChunkList) { // 根据内容计算文件hash串
      return new Promise(resolve => {
        // 封装花时间的任务
        // html5 带来的优化 web workers
        // js是单线程的语言，UI是主线程
        // html5 web workers 单独的开一个线程，独立的，做完之后回调主线程，不会影响原来的UI
        this.container.worker = new Worker("/hash.js"); // 启动新的线程
        this.container.worker.postMessage({ fileChunkList }); // 向线程分派任务并传输参数
        this.container.worker.onmessage = e => { // 接受新线程传回来的信息
          // 等待计算完成之后执行的回调
          // console.log(e.data);
          const { percentage, hash } = e.data; // 解构百分比和hash值
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
      if (!file) return;
      this.resetData(); // 清空上一次上传的请求
      Object.assign(this.$data, this.$options.data());
      this.container.file = file;
    },

    async handleUpload() { // 处理上传
      // 大量的任务
      if (!this.container.file) return;
      this.status = Status.uploading;

      const fileChunkList = this.createFileChunk(this.container.file);// 创建文件切片
      console.log(fileChunkList); // 切片文件
      this.container.hash = await this.calculateHash(fileChunkList); // 计算hash串
      // 文件内容相同 hash值是一样的 没必要重复上传同一个文件
      const { shouldUpload, uploadedList } = await this.verifyUpload(
        // 把文件名和计算出来的hash值交给后端去验证是否上传过
        this.container.file.name,
        this.container.hash
      );
      console.log(shouldUpload, uploadedList);
      if (!shouldUpload) { // 已经上传过 不需要上传
          this.$message.success("秒传：上传成功!"); // element组件的$message函数
          this.status = Status.wait;
          return;
      }
      // fileChunkList 里面每一个都是file(创建时的形式)
      this.data = fileChunkList.map(({ file }, index) => ({
        fileHash: this.container.hash, // 整个文件的hash
        index,
        hash: this.container.hash + '-' + index, // 每个块都有自己的index在内的hash，可排序，可追踪
        chunk: file, // 分片文件
        size: file.size, // 分片文件的大小
        percentage: uploadedList.includes(index) ? 100: 0 // 当前切片是否已经上传过 上传列表中是否有某个文件
      }))
      await this.uploadChunks(uploadedList); // 上传切片
    },

    async verifyUpload(filename, fileHash) { // 上传验证hash，是否应该上传
      const { data } = await this.request({
        url: 'http://localhost:3000/verify', // 交给服务器端验证
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

    async uploadChunks(uploadedList = []) { // 上传切片
      // console.log(this.data);
      // 数据数组this.data => 请求数组 => 并发请求
      const requestList = this.data
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(({ chunk, hash, index }) => {
          const formData = new FormData(); // js 构建post请求表单
          formData.append("chunk", chunk); // 文件 blob
          formData.append("hash", hash); // 文件切片的hash
          formData.append("filename", this.container.file.name); // 文件名 合并的时候需要用到
          formData.append("fileHash", this.container.hash); // 整个文件的hash
          return { formData, index };
        })
        .map(async ({ formData, index }) => 
          this.request({
            url: "http://localhost:3000",
            data: formData,
            onProgress: this.createProgressHandler(this.data[index]),
            requestList: this.requestList
          })
        )
      await Promise.all(requestList); // 等待上传完成
      // 之前上传的切片数量 + 本次上传的切片数量 = 所有切片数量的时候
      if (uploadedList.length + requestList.length == this.data.length) {
        await this.mergeRequest(); // 合并文件
      }
      console.log("可以发送合并请求了");
    },

    createProgressHandler(item) { // 生成进度
      return e => {
        item.percentage = parseInt(String((e.loaded/e.total) * 100));
        console.log(e.loaded, e.total, '---');
      }
    },

    async handleResume() { // 恢复上传
      this.status = Status.uploading;
      const { uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      await this.uploadChunks(uploadedList);
    },

    handlePause() { // 暂停上传
      this.status = Status.pause; // 状态暂停
      this.resetData();
    },

    resetData() { // 暂停上传
      this.requestList.forEach(xhr => xhr?.abort()) // 暂停xhr上传
      this.requestList = []; // 清空xhr
      if (this.container.worker) { // 正在hash计算过程中
        this.container.worker.onmessage = null; // 不再监听worker开启的新进程信息
      }
    },

    async mergeRequest() { // 合并文件
      await this.request({
        url: 'http://localhost:3000/merge',
        headers: {
          "content-type": "application/json"
        },
        data: JSON.stringify({
          size: SIZE, // 每个切片块的大小
          fileHash: this.container.hash,
          filename: this.container.file.name
        })
      })
      this.$message.success('上传成功');
      this.status = Status.wait;
    }
    
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
