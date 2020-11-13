// promise 限流函数
class PromisePool {
  constructor(max, fn) {
    this.max = max; // 最大并发的数量
    this.fn = fn; // 自定义请求函数
    this.pool = []; // 并发池
    this.tasks = []; // 剩余的请求
  }

  start(tasks) {
    this.tasks = tasks;
    while(this.pool.length < this.max) { // 塞满并发池
      let task = this.tasks.shift(); // 从头开始取任务
      this.setTask(task); // 配置任务后续回调信息
    }

    // 运行一个任务
    // 仅仅获取并发池中某一完成的任务，任务还没有注册回调
    let race = Promise.race(this.pool);
    return this.run(race);
  }

  run(race) {
    // 任务完成回调注册，真正执行后续操作
    race.then((res) => {
      console.log(res);
      // 每运行完一个任务之后，并发池就会有一个空位
      // 再继续塞任务填上并发池
      let task = this.tasks.shift(); // 再从头取一个任务
      this.setTask(task);
      return this.run(Promise.race(this.pool));
    })
  }

  // 对任务进行配置，加上任务执行结束的逻辑
  setTask(task) {
    if (!task) return;
    let task = this.fn(task);
    this.pool.push(task); // 将任务放入并发池中
    console.log(`任务${task}进入并发池，当前并发数：${this.pool.length}`);
    // 预先给任务加上结束后的回调
    // 任务结束后将其从并发池中删除
    task.then((res) => {
      this.pool.splice(this.pool.indexOf(task), 1);
      console.log(`任务${task}结束退出并发池，当前并发数：${this.pool.length}`);
    })
  }
}
