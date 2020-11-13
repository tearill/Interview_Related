class FetchLimit {
  constructor(maxLimit) {
    this.maxLimit = maxLimit; // 最大限制
    this.queue = []; // 任务并发池
    this.currFetchCount = 1; // 当前已有的任务
  }

  request(promise, ...args) {
    return new Promise((resolve, reject) => {
      let task = this.createTask(promise.bind(null, args), resolve, reject); // 创建任务
      // 将参数交给 promise 形成新的 promise
      if (this.currFetchCount >= this.maxLimit) { // 当前任务已经足够多
        console.log("超出并发限制");
        this.queue.push(task); // 添加任务
      } else {
        task();
      }
    });
  }

  createTask(promise, resolve, reject) {
    return () => {
      promise()
        .then((v) => resolve(v))
        .catch((e) => reject(e))
        .finally(() => {
          console.log("run next", this.currFetchCount);
          this.currFetchCount--; // 运行结束数量 -1
          if (this.queue.length) { // 并发池中还有任务
            let task = this.queue.shift(); // 取出队头任务
            task(); // 执行任务
          }
        });
      this.currFetchCount++;
    };
  }
}

function delay(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(Date.now()), time);
  });
}

const requestInstance = new FetchLimit(5);

let promises = [];
function test() {
  for (let i = 0; i < 15; i++) {
    let time = Math.random() * 2000;
    console.log("time", i, time);
    promises.push(
      requestInstance.request(delay, time).then(
        (result) => console.log("result", i, result),
        (error) => console.log(error)
      )
    );
  }
}
test();