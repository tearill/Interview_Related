# GET 请求和 POST 请求的区别  

- 参数角度：GET 请求参数一般放在 URL 中，不安全，POST 请求放在请求体中，更适合传输敏感信息  
- 缓存角度：GET 请求会被浏览器主动缓存下来，留下历史记录，POST 请求不会  
- 编码角度：GET 请求只能进行 URL 编码，只能接收 ASCII 码，POST 请求没有限制  
- 幂等性角度：GET 是幂等的，GET 请求对数据没有副作用，POST 不是(幂等指的是执行相同的操作，结果也是相同的)  
- TCP 角度：GET 请求会把请求报文一次性发出去，而 POST 会分为两个 TCP 数据包，首先发 header 部分，如果服务器响应 100(continue)，然后发送 body 部分
  - 并不是所有浏览器都会在 POST 中发送两次包，Firefox 就只发送一次  
- 参数长度角度：URL 通常被限制在 2k，大多数服务器最多处理 64k 的 URL  
- GET 无害： 刷新、后退等浏览器操作 GET 请求是无害的，POST 可能重复提交表单  

## POST 请求的类型  
- application/json  
- application/x-www-form-urlencoded  
- multipart/form-data  
- text/xml  
