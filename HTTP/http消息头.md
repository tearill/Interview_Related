# HTTP 消息头  
- 连接相关的头字段  
  - Connection  
  取值：  
  1. close：在完成本次请求的响应后，断开连接，不再等待本次连接的后续请求  
  2. keep-alive：在完成本次请求的响应后，保持连接，等待本次连接的后续请求  
  3. Upgrade：配置状态码 101 表示协议升级，比如从 HTTP 升级到 WebSocket  

- Keep-Alive：如果浏览器请求保持连接，该头部表明希望服务器保持连接多久的时间(秒)  

- 数据类型使用的头字段  
  1. Accept：客户端告诉服务器希望接收什么样的数据，例如 `Accept: text/html,application/xml,image/webp,image/png`  
  2. Content-Type：传输的数据类型，请求和响应中都可以使用，例如 `Content-Type: text/html`  
  3. Accept-Encoding：客户端支持的压缩格式，例如 `Accept-Encoding: gzip, deflate, br`  
  4. Content-Encoding：服务器实际使用的压缩格式，例如 `Content-Encoding: gzip`  

- 语言类型使用的头字段  
  1. Accept-Language：客户端可理解的自然语言，例如 `Accept-Language: zh-CN, zh, en`  
  2. Content-Language：服务器实体数据使用的实际语言类型，例如 `Content-Language: zh-CN`  
  3. Accept-Charset：语言使用的字符集，响应头中没有对应的 Content-Charset，而是在 Content-type 之后标注，例如：  
  ```bash
  Accept-Charset: gbk, utf-8
  Content-Type: text/html; charset=utf-8
  ```

  > 现在的浏览器都支持多种字符集，通常不会发送 Accept-Charset，而服务器也不会发送 Content-Language，因为使用的语言完全可以由字符集推断出来，所以在请求头里一般只会有 Accept-Language 字段，响应头里只会有 Content-Type 字段

- 缓存相关  
  1. 强缓存相关：Expire、Cache-Control  
  2. 协商缓存相关：Last-Modified、If-Modified-Since、Etag、If-None-Match  

- Content-Type  
  1. application/json  
  2. application/x-www-form-urlencoded  
  3. multipart/form-data  
  4. text/html  
  5. octect/stream  

- Content-Length：服务器告诉浏览器自己响应数据的长度  

- Transfer-Encoding：服务器表明自己的响应消息体做了怎样的编码。比如是否分块  