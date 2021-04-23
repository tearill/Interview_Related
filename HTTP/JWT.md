# JWT (Json-Web-Token) 认证机制  
## JWT  
Json Web Token 是为了在网络应用环境间传递声明而执行的一种基于 JSON 的开放标准，该token被设计为紧凑且安全的，特别适用于分布式站点的单点登录（SSO）场景。JWT的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源，也可以增加一些额外的其它业务逻辑所必须的声明信息，该token也可直接被用于认证，也可被加密  

## JWT 的组成  
三个部分：header + payload + signature  
- header 头部  
  两部分信息  
  1. 声明类型  
  2. 声明加密的算法  
  将头部 base64 加密后形成 JWT 的第一部分  

- payload 载荷，存放有效信息  
  有三个部分  
  1. 标准中注册的声明  
  2. 公共的声明  
  3. 私有的声明  
  - 标准中注册的声明 (建议但不强制使用)
    iss: jwt 签发者  
    sub: jwt 所面向的用户  
    aud: 接收 jwt 的一方  
    exp: jwt 的过期时间，这个过期时间必须要大于签发时间  
    nbf: 定义在什么时间之前，该 jwt 都是不可用的  
    iat: jwt 的签发时间  
    jti: jwt 的唯一身份标识，主要用来作为一次性 token，从而回避重放攻击  

  - 公共的声明  
    公共的声明可以添加任何的信息，一般添加用户的相关信息或其他业务需要的必要信息.但不建议添加敏感信息，因为该部分在客户端可解密  

  - 私有的声明 ：
    私有声明是提供者和消费者所共同定义的声明，一般不建议存放敏感信息，因为 base64 是对称解密的，意味着该部分信息可以归类为明文信息  

  payload base64 化后得到 JWT 的第二部分  

- signature 签证信息  
  三个部分  
  1. header(base64 之后的)  
  2. payload(base64 之后的)  
  3. secret 加密串  
  连接 base64 化之后的 header 和 payload 并用 header 中声明的加密方式结合 secret 加密构成 JWT 的第三部分  

> secret 是保存在服务器端的，jwt 的签发生成也是在服务器端的，secret 是用来进行 jwt 的签发和 jwt 的验证，所以它是服务端的私钥，在任何场景都不应该流露出去。一旦客户端得知这个 secret, 那就意味着客户端是可以自我签发 jwt 

## JWT 的应用  
一般是在请求头里加入 Authorization，并加上 Bearer 标注：  
```js
fetch('api/user/1', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
```

## 传统 session 认证  
