// 实现一个 HardMan:
// HardMan("jack") 输出:
// I am jack

// HardMan("jack").rest(10).learn("computer") 输出
// I am jack
// 等待10秒
// Start learning after 10 seconds
// Learning computer
// HardMan("jack").restFirst(5).learn("chinese") 输出
// 等待5秒
// Start learning after 5 seconds
// I am jack
// Learning chinese

function HardMan(name) {
  this.queue = [() => console.log(`I am ${name}`)]; // 先放置一个任务
  this.learn = function(subject) {
    this.queue.push(() => console.log(`Learning ${subject}`)); // 学习
    return this;
  }
  this.wait = function(time) { // 链式调用
    return () => new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log(`Start learning after ${time} seconds`); // 延时的输出
        resolve();
      }, time * 1000);
    });
  }
  this.waitText = function(time) {
    let _this = this;
    return ()=> {
      console.log(`//等待${time}秒`);
      // resolve();
      return _this;
    }
    // return this;
  }
  this.rest = function(time) { // 等待
    this.queue.push(this.waitText(time));
    this.queue.push(this.wait(time)); // 延时 Start learning after ...
    return this;
  }
  this.restFirst = function(time) {
    this.queue.unshift(this.wait(time)); // 延时
    this.queue.unshift(this.waitText(time));
    return this;
  }
  setTimeout(async () => {
    for(fn of queue) {
      await fn();
    }
  }, 0);
  return this;
}

// HardMan("jack");
HardMan("jack").rest(10).learn("computer"); 
// I am jack 
// 等待10秒 
// Start learning after 10 seconds
// Learning computer
// HardMan("jack").restFirst(5).learn("chinese");
// 等待5秒
// Start learning after 5 seconds
// I am jack
// Learning chinese