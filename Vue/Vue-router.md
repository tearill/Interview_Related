# Vue-router(前端路由) 灵魂拷问  
## 前端路由和后端路由  
- 后端路由  
  每跳转到不同的 URL，都是重新访问服务端，然后服务端返回页面  
  当收到客户端发来的 HTTP 请求，就会根据请求的 URL 去找到相应的映射函数，一般是进行数据库读取或者是数据的处理，然后根据这些数据在服务器端使用相应的模板对页面进行渲染后返回渲染好的页面  
- 前端路由  
  在单页面应用，大部分页面结构不变，只改变部分内容的使用，路由映射的函数通常是进行一些 DOM 的显示和隐藏操作  

## 前端路由和后端路由的优缺点  
- 后端路由的优缺点 
  + 优点：  
    1. 分担了前端的压力，html 和数据的拼接都是由服务器完成  
    2. 安全性好，SEO 好  
  + 缺点：  
    1. 当项目十分庞大时，加大了服务器端的压力  
    2. 在浏览器端不能输入指定的 url 路径进行指定模块的访问  
    3. 如果网速过慢，会延迟页面的加载，对用户体验不好  
- 前端路由的优缺点  
  + 优点：  
    1. 访问新页面的时候知识变换了路径，没有了网络延迟，用户体验好  
    2. 可以在浏览器中输入指定想要访问的 url 路径地址  
    3. 实现了前后端的分离  
  + 缺点：  
    1. 使用浏览器的前进，后退键的时候会重新发送请求，没有合理地利用缓存，不利于 SEO  
    2. 单页面无法记住之前滚动的位置，无法在前进，后退的时候记住滚动的位置  

## 前端路由的实现方案和区别  
- 实现方案：  
  1. hash  
  2. history  
- 区别：  
  最直观的区别是 hash 模式的 url 中会带有一个 #  
  1. **hash 模式下，仅 hash 符号之前的内容会被包含在请求中**，如 `http://www.abc.com`，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误，**改变 hash 不会重新加载页面**  
  2. **history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致**，如 `http://www.abc.com/book/id` 如果后端缺少对 /book/id 的路由处理，将返回 404 错误。Vue-Router 官网里如此描述："不过这种模式要玩好，还需要后台配置支持……所以呢，你要在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。"  


## hash 的实现原理  
hash 的实现是基于 location.hash 实现的，hash 就是 url 中 # 后面的内容(window.location.hash.slice(1))  
可以使用 hashchange 事件来监听 hash 的变化，并且可以通过 history.length 看到路由总数  

## history 的实现原理  
history 这个对象在 html5 的时候新加入两个 API -> `history.pushState()` 和 `history.replaceState()`  
这两个 API 可以在不进行刷新的情况下操作浏览器的历史记录  
`history.pushState()` 是新增一个历史记录，`history.replaceState()` 是直接替换当前历史记录  
- `history.pushState()` 和 `history.replaceState()` 的使用  
  有三个参数：state, title, url  
  state：需要保存的数据，在触发 popstate 事件的时候可以在 event.state 中获取到  
  title：标题，在大多数浏览器忽略这个参数，可以直接用 null 代替  
  url：设定的新的历史记录的 url，必须和当前 url 同源  

## history 的其他 API  
1. window.history.back(); 后退一页  
2. window.history.forward(); 前进一页  
3. window.history.go(1); 前进一页 -2 后退两页  
4. window.history.length; 查看当前历史堆栈中页面的数量  

## history 模式下各种操作的执行怎么监听  
每当同一个文档的浏览历史 history 发生变化的时候，就会触发 `popstate` 事件，可以监听 `popstate` 事件  
- 注意  
  对于单页应用的 history 模式，只有四种方式会引起 url 的改变  
  1. 点击浏览器的前进或后退(或者是调用 back、forward、go 方法)  
  2. 点击 a 标签  
  3. 触发 history.pushState() 事件  
  3. 触发 history.replaceState 事件  

  **对于 pushState 和 replaceState 事件的监听**  
  创建两个全新的事件，时间名为 pushState 和 replaceState，实现全局监听  
  ```js
  // 创建全局事件
  var _wr = function(type) {
    var orgin = history[type];
    return function() {
      var newFun = origin.apply(this, arguments);
      var e = new Event(type);
      window.dispatchEvent(e);
      return newFun;
    }
  }
  // 重写方法
  history.pushState = _wr('pushState');
  history.replaceState = _wr('replaceState');
  // 实现监听
  window.addEventListener('pushState', function(e) {
    console.log('pushState happend!');
  });
  window.addEventListener('replaceState', function(e) {
    console.log('replaceState happened!');
  })
  ```