# 浏览器安全 --- CSRF 攻击  
## CSRF 攻击  
- 什么是 CSRF 攻击  
  CSRF(Cross-site request forgery)跨站请求伪造攻击者诱导用户进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求，利用用户目前的登录状态发起跨站请求  
- CSRF 的攻击类型  
  1. GET 类型的 CSRF  
    只需要一个 HTTP 请求  
    例如：`<img src="https://xxx.com/info?user=xxx&count=100">`  
    在用户访问的时候会自动发送一个包含用户登录信息的 GET 请求  
  2. POST 类型的 CSRF  
    通常使用的是一个自动提交的表单  
    ```html
    <form action="http://bank.example/withdraw" method=POST>
      <input type="hidden" name="account" value="xiaoming" />
      <input type="hidden" name="amount" value="10000" />
      <input type="hidden" name="for" value="hacker" />
    </form>
    <script> document.forms[0].submit(); </script>
    ```
    访问该页面后，表单会自动提交，相当于模拟用户完成了一次 POST 操作  
  3. 链接类型的 CSRF  
    需要用户点击链接才会触发  
    这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击  
> CSRF 攻击不需要将恶意代码注入用户当前页面的 HTML 文档中，而是直接跳转新的页面，利用服务器的验证漏洞和用户之前的登录状态俩模拟用户进行操作  

## CSRF 攻击的防范措施  
CSRF的两个特点：  
1. CSRF(通常)发生在第三方域名  
2. CSRF 攻击者不能获取到 Cookie 等信息，只是使用(冒用)  
- 针对这两点，可以专门制定防护策略，如下：
  + 阻止不明外域的访问  
    1. 同源检测  
    2. Samesite Cookie  
  + 提交时要求附加本域才能获取的信息  
    1. CSRF Token  
    2. 双重 Cookie 验证  

### 同源检测  
  直接禁止外域(或者不受信任的域名)发起请求(请求头判断)  
  1. 使用 Origin 字段确定来源域名，Origin 只包含域名信息  
  2. 使用 Referer 字段确定来源域名，Referer 包含了具体的 URL 路径  

### Cookie 的 SameSite 属性  
  CSRF 攻击中重要的一环就是自动发送目标站点下的 Cookie，然后使用这一份 Cookie 模拟用户身份  
  SameSite 属性有三个值：Strict、Lax、None  
  1. Strict 模式下，完全进制第三方携带 Cookie，只要是跨站点，任何情况下都不会发送 Cookie  
  2. Lax 模式下，大多数情况下不发送 Cookie，但是导航到目标网址的 GET 请求除外  
    导航到目标网址的 GET 请求，只包括三种情况：链接，预加载请求，GET 表单  
  3. None 模式是默认模式，请求会自动携带上 Cookie  

### CSRF Token  
  CSRF的另一个特征是，攻击者无法直接窃取到用户的信息(Cookie，Header，网站内容等)，仅仅是冒用 Cookie 中的信息  
  可以要求所有的用户请求都携带一个 CSRF 攻击者无法获取到的 Token。服务器通过校验请求是否携带正确的 Token，来把正常的请求和攻击的请求区分开，也可以防范CSRF的攻击  

### 双重 Cookie 验证  
  利用 CSRF 攻击不能获取到用户 Cookie 的特点，我们可以要求 Ajax 和表单请求携带一个 Cookie 中的值  
  1. 在用户访问网站页面时，向请求域名注入一个 Cookie，内容为随机字符串  
  2. 在前端向后端发起请求时，取出 Cookie，并添加到 URL 的参数中  
  3. 后端接口验证 Cookie 中的字段与 URL 参数中的字段是否一致，不一致则拒绝  