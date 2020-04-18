# 为什么 script 标签的 src 请求不会跨域，但 Ajax 发送的异步请求会跨域？  

- 同源策略是一个重要的安全策略，它用于限制一个 origin 的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介  

- 同源策略控制不同源之间的交互，例如在使用 XMLHttpRequest 或  标签时则会受到同源策略的约束。这些交互通常分为三类：  

1. 跨域写操作（Cross-origin writes）一般是被允许的。例如链接（links），重定向以及表单提交。特定少数的 HTTP 请求需要添加 preflight。

2. 跨域资源嵌入（Cross-origin embedding）一般是被允许比如 img 的 src、style 的 href、script 的 src

3. 跨域读操作（Cross-origin reads）一般是不被允许的，但常可以通过内嵌资源来巧妙的进行读取访问。例如，你可以读取嵌入图片的高度和宽度，调用内嵌脚本的方法，或 availability of an embedded resource  