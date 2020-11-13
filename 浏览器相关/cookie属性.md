# Cookie 有哪些属性  

## 定义相关  
1. Name  
2. Value  
3. Size

## 生命周期  
1. Expire：设置 Cookie 的过期时间  
2. Max-age：设置在 Cookie 失效之前需要经过的秒数  

## 作用域  
1. Domain：Cookie 可以送达的主机名  
2. path：指定一个 URL 路径，这个路径必须出现在要请求的资源的路径中才可以发送 Cookie 首部  

## 安全相关  
1. Secure：只能通过 HTTPS 传输 Cookie  
2. HttpOnly：只能通过 HTTP 传输，JS 无法访问(预防 XSS)  
3. SameSite：规定浏览器不能在跨域请求中携带 Cookie，减少 CSRF 攻击  
  Strict：完全禁止第三方请求携带 Cookie  
  Lax：限制放宽，只能在 get 表单或者 a 标签携带 Cookie  
  None：默认，请求会自动带 Cookie  