function myPromise(excutor) {
  var self = this
  self.onResolvedCallback = [] // Promise resolve 时的回调函数
  // 传递给 Promise 处理函数的 resolve
  // 直接往实例上挂个 data  
  // 取出 onResolvedCallback 数组里的函数依次执行一遍
  function resolve(value) {
    // promise的then函数需要异步执行
    setTimeout(() => {
      self.data = value
      self.onResolvedCallback.forEach(callback => callback(value))
    })
  }
  // 执行用户传入的函数
  excutor(resolve.bind(self))
}

myPromise.prototype.then = function (onResolved) {
  // 保存上下文，哪个 promise 调用的 then，就指向哪个 promise
  var self = this
  // 一定要返回一个新的 promise
  return new myPromise(resolve => {
    self.onResolvedCallback.push(function () {
      var result = onResolved(self.data)
      if (result instanceof myPromise) {
        // resolve 的权力被交给了 user promise
        result.then(resolve)
      } else {
        resolve(result)
      }
    })
  })
}

// 调用 then 的 promise
new myPromise(resolve => {
  setTimeout(resolve, 1000)
})
  // then2
  .then(res => {
    // user promise
    return new myPromise(resolve => {
      setTimeout(resolve, 1000)
    })
  })
  // then3
  .then(res => {
    console.log(res)
  })

