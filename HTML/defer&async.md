# script 标签的 defer 和 async 属性  
- defer 延迟脚本  
- async 异步脚本  

## 正常 script  
- 正常执行到 script 时，html 解析会停止，并去下载相应的外部文件并执行，执行完成后 html 才会继续解析  

## defer  
- defer 表明脚本在执行时不会影响页面的构造，脚本会被延迟到整个页面都解析完毕之后再运行  
- 在 script 中设置 defer='defer' 属性相当于告诉浏览器立即下载脚本，但是延迟执行  
- 如果有多个脚本设置了 defer 属性，脚本会按照顺序执行，但是现实中延迟脚本不一定会按照顺序执行，也不一定会在 DOMContentLoaded 事件触发之前执行，因此最好只包含一个延迟脚本  
- defer 属性只适用于外部脚本文件，会忽略给嵌入脚本设置的 defer 属性  
- 设置了 defer 之后，执行到 script 标签的时候，外部文件会被同步下载，不会阻塞 html 的解析，等到 html 解析完成之后才会执行  

## async  
- async 同样只适用于外部脚本文件  
- 设置了 async 之后，执行到 script 标签的时候，外部文件会被同步下载，下载期间不阻塞 html 的解析，一旦外部文件下载完成，html 的解析会被暂停转而执行 script 中的外部文件，执行完成后再继续 html 的解析  

> 异步脚本一定会在页面的 loaded 事件前执行，但可能会在 DOMContentLoaded 事件触发之前或之后执行  