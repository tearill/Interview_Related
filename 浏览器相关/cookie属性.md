# Cookie 有哪些属性  

## 生命周期  
1. Expire  
2. Max-age  

## 作用域  
1. Domain  
2. path

## 安全相关  
1. Secure：只能通过 HTTPS 传输 Cookie  
2. HttpOnly：只能通过 HTTP 传输，JS 无法访问  
3. SameSite：  
  Strict：完全禁止第三方请求携带 Cookie  
  Lax：限制放宽，只能在 get 表单或者 a 标签携带 Cookie  
  None：默认，请求会自动带 Cookie  