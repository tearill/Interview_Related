# XMLHttpRequest 与 Fetch 的区别  
1. fetch 对外暴露的接口更加现代化，fetch 是基于 Promise 的，XHR 是基于回调的  
2. fetch 可以很容易的被其他技术使用，例如：可以在 ServiceWorker 中监听浏览器发出的请求，可以在中间做一个代理，使用 fetch 发出这个请求  
  浏览器请求 -> ServiceWorker -> 拿到资源  
3. fetch 只要接收到状态码，就是请求成功，HTTP 错误(404/500)不会导致返回的 Promise 变成 reject  
4. ~~fetch 没有取消或者拒绝的功能，XHR 可以终止或取消这个请求(xhr.abort())~~  
  fetch 可以通过 AbortController 和 AbortSignal 来终止  
  举例：  
  ```js
  const controller = new AbortController()
  const signal = controller.signal
  fetch('./data.json', { signal })
    .then((res) => {})
    .catch((err) => {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        console.log('Another error')
      }
    })
  setTimeout(() => { controller.abort() }, 3 * 1000)
  ```
