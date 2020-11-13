let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  });
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2)
  }, 1000);
})

let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(3)
  }, 2000);
})

Promise.myAll = function (promises) {
  let res = []
  return new Promise((resolve, reject) => {
    let resolvedCount = 0
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(x => {
        res[i] = x
        resolvedCount++
        resolvedCount === promises.length && resolve(res)
      })
      .catch(err => {
        reject(err)
      })
      // (function(i) {
      //   Promise.resolve(promises[i]).then(function(value) {
      //     resolvedCount++
      //     res[i] = value
      //     if (resolvedCount === promiseNum) {
      //       return resolve(res)
      //     }
      //   })
      // })(i)
    }
  })
}

let p = Promise.myAll([p3, p2, p1])

p.then(x => {
  console.log(x)
})