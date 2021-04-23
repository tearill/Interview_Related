function limitedPromise(tasks, limit) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let alive = 0;
    let finish = 0;
    let result = [];

    function trigger() {
      if (finish >= tasks.length) {
        resolve(result);
        return;
      }

      while (alive < limit && index < tasks.length) {
        alive++;
        const promise = tasks[index]();
        let curIndex = index;
        promise
          .then((value) => {
            alive--;
            finish++;
            result[curIndex] = value;
            trigger();
          })
          .catch(err => {
            reject(err);
          })
        index++;
      }
    }

    trigger();
  })
}


function createTask(ms) {
  return () => {
    console.log('add one task', ms);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('finish one task');
        resolve(ms);
      }, ms)
    });
  }
}

const tasks = Array(5).fill(null).map((_, index) => createTask(index * 1000));
limitedPromise(tasks, 2).then(console.log);
