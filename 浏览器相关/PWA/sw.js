const CACHE_NAME = 'sw-' + 0
// 生命周期，注册事件
self.addEventListener('install', (event) => {
  // 等到把要缓存的东西都缓存好，再进入下一个阶段
  // cache-storage
  // 1. 打开 cache-storage 空间
  let cacheComplete = caches.open(CACHE_NAME).then(cache => {
    return cache.addAll([
      './', // http://localhost:8080/
      './sw-lifecycle.png'
    ])
  })
  event.waitUntil(cacheComplete)
})

self.addEventListener('activate', () => { })
// 监听浏览器发出的请求进行判断
// 1. 如果在缓存空间中,直接取出缓存链面的内容返回
// 2. 如果不在缓存空间中,service-workder 帮浏览器发出这个请求,请求完成后再放到缓存里,供下次使用
self.addEventListener('fetch', (event) => {
  // 用什么返回
  let thisReqRes = caches.match(event.request)
    .then((response) => {
      if (response) {
        // 缓存里有,直接 return
        return response
      } else {
        // 缓存里没有,请求完 return 
        fetch(event.request)
          .then(res => {
            return caches.open(CACHE_NAME)
              .then(function (cache) {
                cache.put(event.request, res.clone())
                // res 流
                return res
              })
          })
      }
    })
  
  event.respondWith(thisReqRes)
})