# 浏览器的本地存储  
浏览器的本地存储主要分为 `Cookie`、`WebStorage` 和 `IndexedDB`  
其中 `WebStorage` 又可以分为 `localStorage` 和 `sessionStorage`  

## Cookie  
Cookie 最开始被设计出来不是用作本地存储，而是为了弥补 HTTP 在状态管理上的缺陷  
HTTP 协议是一个无状态协议，客户端向服务器发请求，服务器返回相应，下次发送请求的时候服务端不知道客户端是谁，于是就产生了 Cookie  

Cookie 本质上是浏览器里面存储的一个很小的`文本文件`，内部以键值对的方式存储  
向同一个域名下发送请求，都会携带相同的 Cookie，服务器拿到 Cookie 解析，便可以拿到客户端的状态  

主要用途有身份认证，标记用户  

## Cookie 的缺陷  
1. `容量小`，上限只有 4KB  
2. `性能差`，Cookie 紧跟域名，不管域名下面的某地址需不需要这个 Cookie，请求都会携带上完整的 Cookie，请求数量增加之后会造成性能浪费  
3. `安全性差`，Cookie 以纯文本的形式在浏览器和服务器中传递，容易被非法用户截取、篡改，在 HttpOnly 为 false 的情况下，Cookie 信息可以直接通过 JS 脚本读取  

## localStorage  
有一点和 Cookie 很像，在同一个域名下，会存储相同的一段 localStorage  

## localStorage 和 Cookie 的区别  
1. 容量，localStorage 的上限是 5M  
2. 只存在客户端，默认不参与和服务端的通信，`有效的避免了 Cookie 的性能问题和安全性问题`  
3. 接口封装，可以通过 seiItem 和 getItem 等方法进行操作  
4. 持久化存储  

## localStorage 的应用场景  
利用 localStorage 的较大容量和持久特性，可以利用 localStorage 存储一些内容稳定的资源，比如官网的 logo、存储 Base64 格式的图片资源  

## sessionStorage  
1. 容量，上限 5M  
2. 只存在客户端，默认不参与和服务端的通信  
3. 接口封装  
4. 会话级存储，会话结束(页面关闭)，sessionStorage 就不存在了  

## sessionStorage 的应用场景  
1. 可以用来对表单信息进行维护，将表单信息存储在里面，可以保证页面即使刷新也不会让之前的表单信息丢失  
2. 可以用来存储本次的浏览记录，如果关闭页面后不需要这些记录的话 sessionStorage 非常合适(微博采用了这种方式)  

## IndexedDB  
IndexedDB 是运行在浏览器中的非关系型数据库  
1. 键值对存储，内部采用对象仓库存放数据  
2. 异步操作，数据库的读写数据 I/O 操作，浏览器中对异步 I/O 提供了支持  
3. 受同源策略的限制，无法访问跨域的数据库  

## 总结  
1. Cookie 不适合存储，存在缺陷  
2. localStorage 和 sessionStorage 默认不会参与和服务器的通信  
3. IndexedDB 是运行在浏览器上的非关系型数据库，为大型数据的存储提供了接口  