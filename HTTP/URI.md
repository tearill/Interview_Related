# URI 理解  
URI 全称是 Uniform Resource Indentifier -> 统一资源标识符 -> 作用是区分互联网上不同的资源  
表示的是 web 上每一种可用的资源，如 HTML 文档、图像、视频片段、程序等都由一个 URI 进行定位的  
网址指的是 URL，URI 包含了 URN 和 URL 两个部分，URL 是 URI 概念的一种实现  

## URI 的结构  
  schema://user:passwd@host:port/path?query#fragment  
  1. schema: 协议名，例如 http、https、file 等，后面必须和 :// 连在一起  
  2. user:password@: 表示登录主机时的用户信息，不安全，不推荐使用也很少使用  
  3. host:port: 表示主机名和端口  
  4. path: 表示请求路径，标记资源所在的位置  
  5. query: 表示查询参数，形式是 key = val，多个键值对之间用 & 隔开  
  6. fragment: 表示 URI 所定位资源中的一个锚点，浏览器可以根据这个锚点跳转到对应的位置  
  举例: https://ihorace.cn/articles?id=123456#titile-2  
  http 默认端口为 80，https 默认端口为 443  

## URI 编码  
  URI 只能使用 ASCII，不支持显示 ASCII 以外的字符，还有一部分符号是界定符  
  编码机制：所有的非 ASII 码字符和界定符转为十六进制字节值，然后在前面加上一个 %  
  例如：空格 -> %20  