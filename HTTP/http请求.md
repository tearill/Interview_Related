# HTTP 请求方式  

1. GET：获取信息  
2. POST：提交数据，上传信息  
3. PUT：修改更新数据，例如：PUT https://ihorace.cn/articles/xxx，整体覆盖  
4. HEAD：不需要响应体，只获取响应头  
5. DELETE：删除资源  
6. PATCH：对**已知资源**进行局部更新，例如：PATCH https://ihorace.cn/articles/xxx 对里面具体的内容进行局部的修改  
7. OPTIONS：列出可对资源实行的请求方法，在不获取资源的情况下，了解资源的信息(比如文件大小、是否存在、是否修改过)  
8. CONNECT：HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器
9. TRACE：追踪请求-响应的传输路径，回显服务器收到的请求，主要用于测试或诊断  