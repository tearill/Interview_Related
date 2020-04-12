# Promise  

## Promise 凭借什么消灭了回调地狱？  
Promise 利用了三大技术手段来解决回调地狱：  
1. 回调函数延迟绑定  
2. 返回值穿透  
3. 错误冒泡  
优点：  
1. 实现链式调用，解决多层嵌套  
2. 实现错误冒泡后一站式处理，解决每次任务中判断错误、增加代码混乱都的问题  
举例：  
  ```js
  let readFilePromise = (filename) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }
  readFilePromise('test.json').then(data => {
    return readFilePromise('test.json');
  });
  ```
  其中的回调函数不是直接声明的，而是通过后面的 then 方法传入的，这就是**回调函数延迟绑定**  

举例：  
  ```js
  let x = readFilePromise('test.json').then(data => {
    return readFilePromise('test.json'); // 返回一个 Promise
  });
  x.then(...);
  ```
  上面代码会根据 then 中函调函数的传入值创建不同类型的 Promise，然后把返回的 Promise 穿透到外层，方便后续调用，这就是**返回值穿透**  

举例：  
  ```js
  readFilePromise('test.json').then(data => {
    return readFilePromise('test2.json');
  }).then(data => {
    return readFilePromise('test3.json');
  }).then(data => {
    return readFilePromise('test4.json');
  }).catch(err => {
    ...
  });
  ```
  前面产生的错误会一直向后传递，被最后的 catch 接收到，就不用频繁的检查错误  
