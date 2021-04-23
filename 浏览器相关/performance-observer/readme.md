# PerformanceObserver
- resource  
- paint:  
  - FP 第一个像素落点  
  - FCP：Fitst-Content-Paint  
  - FMP: First-Meaingful-Paint  
- navigation(url -> 看到页面)  
  - domCompleted：DOM 解构生成完毕  
  - domContentLoadedEventEnd：网页需要执行的脚本执行完成时间  
  - **domContentLoadedEventStart：domContentLoaded 事件发生的时间**  
  - domInteractive：DOM 树创建完成(浏览器渲染，生成 DOM 树的阶段)  
  - **loadEventStart：load 时间点**  

- longtask: 长任务(任何超过 50ms 的任务)  
- mark: 打点测量  
- measure: 在每个点之间测量  