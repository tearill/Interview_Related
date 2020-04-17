# 如何监控网页崩溃  
基于 Service Worker 的崩溃统计方案

随着 PWA 概念的流行，对 Service Worker 也逐渐熟悉起来。基于以下原因，可以使用 Service Worker 来实现网页崩溃的监控：  

Service Worker 有自己独立的工作线程，与网页区分开，网页崩溃了，Service Worker 一般情况下不会崩溃；  
Service Worker 生命周期一般要比网页还要长，可以用来监控网页的状态；  
网页可以通过navigator.serviceWorker.controller.postMessage API 向掌管自己的 SW 发送消息。  
基于以上几点，我们可以实现一种基于心跳检测的监控方案：  

p1：网页加载后，通过postMessageAPI 每5s给 sw 发送一个心跳，表示自己的在线，sw 将在线的网页登记下来，更新登记时间；  
p2：网页在beforeunload时，通过postMessageAPI 告知自己已经正常关闭，sw 将登记的网页清除；  
p3：如果网页在运行的过程中 crash 了，sw 中的running状态将不会被清除，更新时间停留在奔溃前的最后一次心跳；  
sw：Service Worker 每10s查看一遍登记中的网页，发现登记时间已经超出了一定时间（比如 15s）即可判定该网页 crash 了。  