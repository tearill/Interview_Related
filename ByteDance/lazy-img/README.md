# 头条面试题 --- lazy-img  

- 图片的延迟加载  
  http 请求是并发的，浏览器并发数是有限的  
  + PC端 wifi：图片数量过多 -> 并发太多 -> 处于竞争状态 -> 页面打开速度下降  
  + 手机端 4G：要考虑流量问题  

- 图片异步加载  
  `npm i vue-lazyload`  
  ```js
  Vue.use(VueLazyload, {
    // CommonJS
    error: require('./assets/loading.svg'), // error 时候展示的图
    loading: require('./assets/loading.svg'), // 加载中
    attempt: 1 // viewport 视窗
  })
  ```
  图片上 v-lazy  

- 优化  
  1. 图片有哪些类型？  
     + jpg、jpeg、svg、gif、bmp、png、webp  
     + 在 banner 位或者是商品详情，色彩丰富的设计稿，一般是 jpg、jpeg  
     + 使用 webp 格式代替 jpg，google 新的图片格式标准，在效果一样的前提下，省下至少 28%-40% 的大小，变相提升网页的性能  
     + 在重要位置的图片使用 webp 代替 jpg  
     + 举例：https://img11.360buyimg.com/pop/s1180x940_jfs/t1/103557/6/14052/88126/5e5efa66E8b8e2594/71b285b0414267a8.jpg.webp  
     + webp 有些浏览器不支持  
       使用 node 进行图片处理，提供两套图片，如果不支持还是显示 jpg  
       压缩后像素点还是一样的  
  2. 上线流程 webp  
     两套图片  
     .jpg(低版本浏览器)  ||  .jpg.webp(chorme 和新版本)  
  3. png 透明  
     支持透明(有透明通道)，透过图片看底部的东西，做圆角  
     同样的形式图片会更大，不太适合做大图  
     适合设计本身并不大的图片，小图  
  4. gif  动图  
  5. 雪碧图 css position  
     有效的将 http 请求降下来  
  6. base64 化  
          
  + node 压缩实现  
    使用 webp-converter 库  