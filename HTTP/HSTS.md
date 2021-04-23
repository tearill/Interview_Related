# HSTS(HTTP Strict Transport Security)  
## 浏览器如何知道协议？

浏览器默认使用 HTTP 协议，并且默认 80 端口

1. 最简单的方式：如果是 HTTPS 协议的网站，会对 80 端口进行监听，将 80 端口上的返回请求重定向到 HTTPS  443 端口上，返回 301/302 等重定向状态码

2. 安全的方式：HTTP 协议实现了一个 HSTS 机制

  HTTP Strict Transport Security，意译：HTTP 严格传输安全，是一个 Web 安全策略机制。

  返回的 重定向 响应报文中有这样一条

  `Strict-Transport-Security: <max-age=>[; includeSubDomains][; preload]`

  `Non-Authoritative-Reason: HSTS`

  其含义是强制浏览器在 max-age 到期之前，把所有的 HTTP 方式访问自动转换成 HTTPS 方式访问

  它可以让浏览器得知，在接下来的一段时间内，当前域名只能通过 HTTPS 进行访问，并且在浏览器发现当前连接安全的情况下，强制拒绝用户的后续访问要求

  是浏览器实现的 url 转换，不用每次访问两次服务器，一步到位。这样避免了 302 跳转 80 -> 443 的中间人劫的问题。所以之后每次访问就不会出现 302 了，只有第一次会出现

3. HSTS 可能存在的问题：当浏览器没有当前网站的 HSTS 信息时，或者是第一次访问该网站，依然需要一次 HTTP 文请求和重定向才可以切换到 HTTPS 并保存 HSTS 信息，这给攻击者实施中间人攻击提供了机会  

解决方案：Preload List，在浏览器内置一个列表，只要是这个列表中的域名，无论什么情况下浏览器都只能使用 HTTPS 发起请求  

## 实际例子  
1. 百度：https://www.baidu.com 使用了 `307 Internal Redirect`，开启了 HSTS  
2. 微博：https://weibo.com 使用了 `307 Internal Redirect`，开启了 HSTS  
3. 字节跳动：https://bytedance.com 使用了 `301 Moved Permanently (from disk cache)` 未开启 HSTS，网站升级 HTTPS 使用了 301 永久重定向  
