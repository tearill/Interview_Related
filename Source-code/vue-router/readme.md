# vue-router 的源码实现  
参考掘金原文👉https://juejin.im/post/5d2d19ccf265da1b7f29b05f  

## 总体分析  

- vue-router  
  现在大部分的 Web 项目都是单页应用 --- SPA  
  不用切换页面，带来更快的加载感受  
  / -> /search  
  1. url 发生改变 
  2. 跳转页面  
  vue-router -> routes -> search.component -> render -> `<router-view />`  

- 传统的路由切换 --- 刷新整个页面  
  /search 发送 http 请求给服务器 -> controller -> 数据库 -> 模板 view -> 返回 html --- 会白一下(刷新)
  
- vue-router 的切换 --- 不会重新刷新整个页面  
  所有的代码最后会在本地的 app.js 直接找到 search.vue 挂载到页面的 `<router-view />` --- 速度特别快 很快 mounted  

- window.location -> 当前的网页信息  
  1. window.location BOM 中的对象  
  2. hash 是 location 的一部分 http[s]://www.baidu.com:8080/  
     path?a=1#haha 变化不会带来页面的刷新  
  window.location.hash --- 可以拿到 hash 模式的路由中 #/... 部分  
  通过切割拿到 path 部分 -> 去到 routes 匹配组件进行渲染  

## hash 方式实现  
  页面中放置 div 模拟 Vue 中的根元素 #app  
  1. 创建 hash 路由类 -> routers 存储不同 hash 值对应的回调函数(模拟各个路由对应执行的操作)  
  2. registerIndex() --- 注册首页的回调操作  
  3. register() --- 注册各个页面的回调操作  
  4. 构造函数中监听 hashchange 事件，在 routers 中取出相应的回调函数进行执行  
  5. 注册回调修改 div 中的文本模拟切换路由时候的页面操作  
  ps: handler.call(this); 使用 call 绑定当前 hash 路由对象，是为了在切换 hash 页面的时候可以拿到 routers 的数据，更加合理  