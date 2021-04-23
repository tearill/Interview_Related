# 深入理解Node.js中的进程与线程  
- 参考👉https://juejin.im/post/5d43017be51d4561f40adcf9  

- 前端的角度来看待线程与进程  
- node 进程 子进程cluster 多核CPU的利用 GO  
- pm2 线上node 运行进程管理  
- docker 容器  
- k8s  

1. 从前端角度开始  
   - Node.js是单线程吗？  js 运行在服务器端  
     js是单线程语言，html css js .vue .jsx node koa  

     为什么 js 天生是单线程语言  
     + 浏览器需要渲染 DOM  
       JavaScript 可以修改 DOM 结构  
       JavaScript 执行时，浏览器 DOM 渲染停止  
     + 如果 JavaScript 引擎线程不是单线程的，那么可以同时执行多段 JavaScript，如果这多段 JavaScript 都修改 DOM，那么就会出现 DOM 冲突。  

     java 有主线程，开辟新的线程的概念  

     js 基于事件机制 event loop 回调，从另一个角度解决了多线程多进程的能力问题  

     不是？ 

   - 应用运行时，本质就是CPU运行的权力，进程是分配资源的最小单元  

     进程是线程的容器  

     进程是线程的容器 线程是 CPU 计算的最小单元  

     单线程 一个进程只产生一个线程  

     单线程 js ajax 微软公司发明的  

     新的线程创建出来 ajax 单线程对象  

     js 是单线程的，但是 js 的宿主 -- 浏览器(容器)，多进程(http并发 img css html js)，多线程，ajax 由浏览器分配进程创建  

     注册在主线程 event 事件里  

     线程间可以相互通信

2. node 当前main.js 启动了一个进程 <=> process pid(进程号)  

   服务器端天生就是多线程的(为很多人服务)，分布式的  

   js 在服务器端执行，单线程的  

   node 是服务器端js执行的容器 node是多进程  

- js 单线程，但是它运行的容器 -- 浏览器，是多进程、多线程的  
  
  node.js 容器 node 异步无阻塞 高并发 
  
  创建进程、线程  

- 进程的两种方式  

  child_process  fork  web-worker  

  cluster  fork  

  提升运行效率，把 CPU 利用起来  

  nginx 负载均衡  