# 实现一个大文件上传和断点续传  
参考掘金原文👉https://juejin.im/post/5dff8a26e51d4558105420ed  

文件上传是开发中的难点，大文件上传及断点续传，难点中的细节及核心技术点。  
考察ES6文件对象、ajsx上传，async await promise、后台文件存储、流操作等全面的全栈技能的同时，提升难度到大文件和断点续传，考察全面解决问题的能力和技术细节。  
移动时代图片成为社交的主流，短视频时代铁定是大文件，上岗后必须掌握的。  

文件  长传  8M  size  1M  8份
切片  
1. js 在 ES6 文件对象file node stream 文件处理能力有所增强  
   任何文件都是二进制，分割Blob  
   start, size, offset  
   http请求可并发 n个切片并发上传 速度更快 改善体验  

- 前端的切片，让http并发带来上传大文件的快感  
  1. file.slice 完成切片。blob 类型的文件切片，js 二进制文件类型的。blob协议，在文件上传到服务器之前就可以提前预览。  

- 服务器端  
  如果将这些切片合并成一个，并且能显示原来的图片  
  stream 流  
  可读流，可写流  
  chunk 都是一个二进制流文件  
  Promise.all 来包装每个chunk的写入  
  start end fs.createWriteStream  
  每个chunk写入 先创建可读流，再pipe给可写流的过程  
  思路：以原文件作为文件夹的名字，在上传blobs到这个文件夹，并且每个blob都以文件-index的命名方式来存储  

- http并发上传大文件切片  