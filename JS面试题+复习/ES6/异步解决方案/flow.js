let p = Promise.resolve(1);
let p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(234);
  }, 2000);
});

(async () => {
  // await 后面接的是 promise
  // 接 promise 才能保证顺序
  let c = await p;
  let d = await p2;
  let f = await 789;
  console.log(c);
})()

// 怎么保证 p resolve，后面的代码才会执行
// 都用 Promise.resovle 包裹一层，不用判断 await、yield 后面到底是 promise(有 then 方法)还是非 promise(没有 then 方法)
Promise.resolve(p).then(() => {
  Promise.resolve(p2).then(() => {
    Promise.resolve(789).then(() => {
      console.log(c);
    })
  })
})

// 下一个 yield 代码(g.next()) 怎么挪到 then 回调里面
