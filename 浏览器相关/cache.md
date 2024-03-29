# 浏览器的缓存  
浏览器的缓存机制：  
1. 强缓存  
2. 协商缓存  
3. 缓存位置  

缓存是指代理服务器或客户端磁盘内保存的资源副本。利用缓存可减少对服务器的访问，因此也就节省了通信流量和通信时间  
浏览器缓存(Brower Caching)是浏览器在本地磁盘对用户最近请求过的文档进行存储，当访问者再次访问同一页面时，浏览器就可以直接从本地磁盘加载文档  
**浏览器缓存分为强缓存和协商缓存**  

## 强缓存  
强缓存是利用http的返回头中的Expires或者Cache-Control两个字段来控制的，用来表示资源的缓存时间  
浏览器中的缓存作用分为两种情况，一种是需要发送 HTTP 请求，一种是不需要发送  
首先是检查强缓存，这个阶段不要发送 HTTP 请求  
`HTTP1.0`时，使用的是 **Expires**，`HTTP1.1`时，使用的是 **Cache-Control**  
### Expires  
  `Expires` 即过期时间，存在于服务端返回的响应头中，告诉浏览器在这个过期时间内可以直接从缓存里面获取数据，无需再次请求  
  它的值为一个绝对时间的GMT格式的时间字符串，比如：  
  ```js
  Expires: Mon, 22 Sept 2020 23:59:59 GMT
  ```
  表示资源在 `2020年9月22日23:59:59` 过期失效，过期了就要向服务器端发请求  
  这种方式有一个明显的缺点，由于失效时间是一个绝对时间，`服务器的时间和浏览器的时间可能不一致`，所以服务器返回的这个过期时间可能就是不准确的，所以在 HTTP1.1 版本中被抛弃了  

### Cache-Control  
  在 HTTP1.1 中采取了 `Cache-Control`  
  它和 `Expires` **本质的不同是它没有采用具体的过期时间点这个方式**，而是采用过期时长来控制缓存，对应的字段是 `max-age`，它是一个相对时间，比如：  
  ```js
  Cache-Control:max-age=3600
  ```
  代表资源的有效期是 3600 秒，响应返回后在 3600 秒，也就是一个小时之内可以直接使用缓存  
  常用的配合设置的值：  
  1. public：可以被所有的用户缓存，包括客户端和 CDN 等中间代理服务器(因为一个请求可能要经过不同的代理服务器才到达目标服务器)  
  2. private：只能被浏览器缓存，不允许 CDN 等中间代理服务器缓存  
  3. no-cache：不使用本地缓存，跳过当前的强缓存，直接进入 `协商缓存阶段`(资源缓存到了本地，但是要对比)  
  4. no-store：直接禁止浏览器缓存，不进行任何形式的缓存，每次请求都要向服务器发送一个请求(完全禁止缓存)  
  5. s-maxage：和 `max-age` 比较像，但是区别在于 `s-maxage` 是针对代理服务器的缓存时间  
  `当 Expires 和 Cache-Control 同时存在的时候，Cache-Control 会优先考虑`  
  **当缓存资源超时，强缓存失效的时候，就会进入到协商缓存阶段**  

## 协商缓存  
  协商缓存就是由服务器来确定缓存资源是否可用，所以客户端与服务器端要通过某种标识来进行通信，从而让服务器判断请求资源是否可以缓存访问  
  强缓存失效后，浏览器在请求头中携带相应的 `缓存tag` 来向服务器请求资源，由服务器根据这个 tag，来决定是否使用缓存  

  具体来说，这样的缓存 tag 分为两种：**Last-Modified** 和 **ETag**，两者并不存在谁对谁有绝对的优势  

### Last-Modified / If-Modify-Since  
  `Last-Modified` 最后修改时间，在浏览器第一次给服务器发送请求后，服务器会在响应头中加上这个字段  
  浏览器收到后，如果再次请求，会在请求头中携带 `If-Modify-Since` 字段，这个字段的值也就是服务器传来的最后修改时间  
  服务器拿到请求头中的 `If-Modify-Since` 的字段后，就会和服务器中 `该资源的最后修改时间对比`：  
  1. 如果请求头中的这个时间小于最后修改时间，说明需要更新，返回新的资源  
  2. 否则返回 304(不会返回资源内容)，告诉浏览器内容没有修改，可以直接使用内存  

### Etag / If-None-Match  
  与 Last-Modified/If-Modified-Since 不同的是，Etag/If-None-Match 返回的是一个校验码  
  `Etag` 是服务器根据当前文件的内容，给文件生成的唯一标识，只要里面的内容有改动，这个值就会变化  
  浏览器接收到 `Etag` 的值，会在下次请求时，将这个值作为 `If-None-Match` 这个字段的内容，并放在请求头中发送给服务器  
  服务器拿到请求头中的 `If-None-Match` 后，就会和服务器中的 `Etag` 进行比对：  
  1. 如果两者不一样，说明需要更新，返回新的资源  
  2. 否则返回 304(不会返回资源内容)，告诉浏览器内容没有修改，可以直接使用内存  

### 两者对比  
  1. **在精确度上，Etag 优于 Last-Modifify**  
    Etag 是按照资源内容做标记，因此可以准确的感知到资源的变化  
    Last-Modified 在一些特殊情况不能准确的感知资源的变化(**这也是 Etag 产生的原因**)：  
    + 一下文件可能会进行周期性的更改，编辑了资源文件，但是文件内容没有更改，这样也会造成缓存失效，但这个时候并不希望客户端认为这个文件被修改了而重新 GET  
    + Last-Modified 能够感知的时间单位是秒，如果文件在 1 秒内修改了 N 次，这个时候 Last-Modified 无法判断修改  
  2. **在性能上，Last-Modified 优于 Etag**  
    Last-Modified 只是记录一个时间点，而 Etag 需要根据文件的具体内容生成 hash 值  

### 用户对缓存的行为  
  用户操作       | Expires/Cache-Control | Last-Modified/Etag 
  ------------- | ---------------------- | ------------------
  地址栏回车     | 有效                   | 有效
  页面链接跳转   | 有效                   | 有效
  新开窗口       | 有效                   | 有效
  前进回退       | 有效                   | 有效
  F5 刷新        | 无效                   | 有效
  Ctrl + F5 强制刷新 | 无效               | 无效

### 实际问题分析  
代码更新到线上后用户浏览器不能自行更新，不能要求客户在系统更新后都进行一次缓存清理的操作  
在资源请求的URL中增加一个参数，比如：js/mian.js?ver=0.7.1。这个参数是一个版本号，每一次部署的时候变更一下，当这个参数变化的时候，强缓存都会失效并重新加载。这样一来，静态资源，部署以后就需要重新加载。这样就比较完美的解决了问题  

## 缓存位置  
  强缓存命中或者协商缓存阶段服务器换回 304 的时候，直接从缓存中获取资源  
  浏览器中的缓存位置一共有四种，按优先级从高到低依次为：  
  1. Service Worker  
  2. Memory Cache  
  3. Disk Cache  
  4. Push Cache  

### Service Worker  
  `Service Worker` 借鉴了 Web Worker 的思路，即让 JS 运行在主线程之外，由于它脱离了浏览器的窗体，因此无法直接访问 DOM。虽然如此，但它仍然能帮助完成很多有用的功能，比如`离线缓存`、`消息推送`和`网络代理`等功能。其中的`离线缓存`就是 Service Worker Cache  

### Memory Cache 和 Disk Cache  
 ` Memory Cache` 指的是内存缓存，从效率上讲它是最快的。但是从存活时间来讲又是最短的，当渲染进程结束后，内存缓存也就不存在了  
  `Disk Cache` 就是存储在磁盘中的缓存，从存取效率上讲是比内存缓存慢的，但是它的优势在于存储容量和存储时长  
  1. 比较大的 JS、CSS 文件会直接被丢进 Disk Cache，反之丢进 Memory Cache  
  2. 内存使用率比较高的时候，文件优先进入 Disk Cache  

  > 刷新页面的时候图片资源大部分来自 Memory Cache(比如微博)，大部分 JS、CSS 都来自 Disk Cache  

### Push Cache  
  即推送缓存，这是浏览器缓存的最后一道防线，是 HTTP/2 中的内容，虽然现在应用的并不广泛，但随着 HTTP/2 的推广，它的应用越来越广泛  

## 总结  
  1. 首先通过 Cache-Control 验证强缓存是否可用  
    - 如果强缓存可用，直接使用  
    - 如果强缓存不可能，进入协商缓存阶段，发送 HTTP 请求，服务器通过请求头中的 If-Modify-Since 或者 If-None-Match 字段检查判断是否资源是否更新  
      + 如果资源更新，返回资源和 200 状态码  
      + 如果资源为更新，返回 304，告诉浏览器直接从缓存获取资源  