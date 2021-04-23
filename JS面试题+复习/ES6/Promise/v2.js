function CutePromise(executor) {
  this.status = 'pending' // 默认正在执行中
  // resolve -> fulfilled
  // reject -> rejected
  this.value = null
  this.reason = null
  this.onFulfilledCbs = []
  this.onRejectedCbs = []
  let self = this
  function resolve(value) {
    // 状态改变
    self.status= 'fulfilled'
    self.value = value
    console.log('resolve')
    // console.log('val', value)
    // 让 then onFulfilled 回调调用
    for (let fn of self.onFulfilledCbs) {
      fn(value)
    }
  }
  function reject(reason) {
    self.status = 'rejected'
    self.reason = reason
    // 让 then onRejected 回调调用
    for (let fn of self.onRejectedCbs) {
      fn(reason)
    }
  }
  executor(resolve, reject)
}

CutePromise.prototype.then = function(onFulfilled, onRejected) {
  let self = this
  if (self.status === 'fulfilled') {
    onFulfilled(self.value)
  } else if (self === 'rejected') {
    onRejected(self.reason)
  } else if (self.status === 'pending') {
    self.onFulfilledCbs.push(onFulfilled),
    self.onRejectedCbs.push(onRejected)
  }
}

new CutePromise((resolve, reject) => {
  // console.log(resolve, reject)
  // resolve(456) // 成功时候的值通过 resolve 传输
  // reject('err')
  setTimeout(() => {
    resolve(666)
  }, 2000);
})
.then((res) => {
  console.log('then')
  console.log(res)
})
