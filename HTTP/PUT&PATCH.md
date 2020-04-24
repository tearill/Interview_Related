# PUT 请求和 PATCH 请求的区别  
PUT 和 PATCH 都是给服务器发送修改资源，而 PATCH 用来对已知资源进行局部更新  

- 举例  
  博客中某一篇文章资源的 URI 地址可以表示为：https://ihorace.cn/articles/xxxx  
  ```js
  article = {
    author: 'Horace',
    createData: new Date(),
    content: '大三前端练习生',
    id: 123456
  }
  ```
  当修改文章的作者的时候，**如果使用 PUT 请求，资源是以覆盖的形式进行更新**  
  PUT https://ihorace.cn/articles/xxxx  
  ```js
  artucle = {
    author: 'Horace22222',
    createDate: new Date(),
    content: '大三前端练习生',
    id: 123456
  }
  ```
  PUT 请求修改 author 字段的时候，必须发送一份文章完整的数据信息  
  **而使用 PATCH 请求的时候，可以对资源进行局部的更新，而不是覆盖的形式**  
  PATCH https://ihorace.cn/articles/xxxx  
  ```js
  {
    author: 'Horace22222'
  }
  ```
  PATCH 可以直接修改 author 字段