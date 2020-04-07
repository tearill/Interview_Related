let p = Promise.resolve(1);
let p2 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(234);
  }, 2000);
});

function* test() {
  let a = yield p;
  console.log(a);
  let b = yield p2;
  console.log(b);
}

// 1. 执行 generator  
// 2. 保证顺序
function asyncTogenerator(gen) {
  let g = gen();
  function step(value) {
    let info = g.next(value);
    // 处理 yield 返回值问题
    if (info.done) {
      return;
    } else {
      // 把 yield 后面的东西(info.value)直接 resolve
      Promise.resolve(info.value).then((res) => {
        // 下一个 yield 下一个递归
        // 第一次 1
        step(res);
      })
    }
  }
  step();
}

asyncTogenerator(test);