class LimitedPromise {
  constructor(limit) {
    this.limit = limit; // 最大并发数
    this.count = limit; // 任务队列中任务数量
    this.queue = []; // 并发任务队列
    // this.extraTask = []; // 超出限制的任务
  }

  setTask(task) {
    if (!task) return false; // 没传 task
    if (this.queue.length >= this.limit) {
      console.log('任务并发数达到上限，任务执行');
      // 到达并发上限的时候还在传递任务进来，用 extraTask 暂存
      // this.extraTask.push(task); // 保存超出的任务
      // console.log(this.queue, '+++++++');
      this.runTask(this.queue, task); // 到上限开始执行，task 传过去，执行完再添加
    } else {
      this.pushTask(task); // 追加
    }
  }

  pushTask(task) {
    console.log('添加一个任务');
    this.queue.push(task);
    this.count++;
  }

  runTask(queue, extraTask) {
    let _this = this;
    let task = Promise.race(queue); // race 出一个执行的任务
    // let task = queue.shift();
    // console.log(task);
    // return;
    task.then((res) => {
      console.log(res, '-----promsie result');
      _this.queue.shift();
      // console.log(_this.queue, '------after filter');
      // console.log(task);
      // return;
      _this.count--; // 执行一个减少一个
      if (_this.count === 0) { // 全部执行完了
        return;
      }
      // console.log(_this.queue, '------');
      // 执行完一个 task 后再追加一个
      extraTask && this.pushTask(extraTask);
      this.runTask(this.queue); // 继续执行剩下的任务
    })
  }
}

let a = 1;
let task = new Promise((resolve, reject) => {
  a = a + 1;
  resolve(a);
})

let instance = new LimitedPromise(6);

function test() {
  for (let i = 0; i < 10; i++) {
    instance.setTask(task);
    console.log(i, '++++++++++++');
  }
}

test();
