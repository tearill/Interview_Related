# Koa 与 Express 的对比  
Koa 是 Express 原班人马基于 ES6 新特性重新开发的敏捷开发框架  
**Koa -> "精简彪悍"**  

1. Koa 相比 Express 更加的精简，体积更小  
  Koa 主要基于 co 中间件框架，只保留了内核级别(非常重要的)中间件，大部分功能需要自行 require  
  Express 则是基于 Connect 中间件框架，封装了大量便利的功能，比如路由、视图处理等等  
2. 异步流程的控制  
  Express 采用回调的方式来处理异步，Koa 是基于 async/await  
3. 错误处理方面  
  Express 采用回调捕获异常，无法对深层次的异常进行捕获，Koa 采用 try/catch  