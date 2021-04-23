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
  // 任务池
  this.taskQueue = [() => { console.log(`I am ${name}`) }]; // 任务池中一定有一个名字输出的任务

  // Learn ... 学习某门课程
  this.learn = function(subject) {
    this.taskQueue.push(() => { console.log(`Learning ${subject}`) }); // Learning ...
    return this;
  }

  this.wait = function(time) {
    return () => new Promise((resolve, reject) => {
      console.log(`等待${time}秒`);
      setTimeout(() => {
        time === 1 && console.log(`Start learning after ${time} second`);
        time !== 1 && console.log(`Start learning after ${time} seconds`);
        resolve();
      }, time * 1000);
    })
  }

  this.rest = function(time) {
    this.taskQueue.push(this.wait(time));
    return this;
  }

  this.restFirst = function(time) {
    this.taskQueue.unshift(this.wait(time));
    return this;
  }

  setTimeout(async () => {
    for (fn of taskQueue) {
      await fn();
    }
  }, 0);
  return this;
}

// HardMan("jack");
// HardMan("jack").rest(10).learn("computer");
// I am jack 
// 等待10秒 
// Start learning after 10 seconds
// Learning computer
HardMan("jack").restFirst(5).learn("chinese");
// 等待5秒
// Start learning after 5 seconds
// I am jack
// Learning chinese