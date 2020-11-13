function CutePromise(executor) {
  this.status = 'pending' // 默认正在执行中
  // resolve -> fulfilled
  // reject -> rejected
  this.value = null
  this.reason = null
  let self = this
  function resolve(value) {
    // 状态改变
    self.status= 'fulfilled'
    self.value = value
    // console.log('val', value)
  }
  function reject(reason) {
    self.status = 'rejected'
    self.reason = reason
  }
  executor(resolve, reject)
}

CutePromise.prototype.then = function(onFulfilled, onRejected) {
  let self = this
  if (self.status === 'fulfilled') {
    onFulfilled(self.value)
  } else if (self === 'rejected') {
    onRejected(self.reason)
  }
}

new CutePromise((resolve, reject) => {
  // console.log(resolve, reject)
  // resolve(456) // 成功时候的值通过 resolve 传输
  // reject('err')
  //! 异步的时候无法解决
  setTimeout(() => {
    resolve(666)
  }, 2000);
})
.then((res) => {
  console.log(res)
})
