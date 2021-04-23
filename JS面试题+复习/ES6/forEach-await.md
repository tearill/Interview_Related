# forEach 中使用 await 中会产生什么问题？  
## forEach 的顺序不确定性  
对于异步代码，forEach 不能保证按顺序进行执行  
(比如做的商业项目里面分类页面，根据在大分类里面匹配到的小分类 id，然后去商品表接口获取数据使用 forEach 想和对应的小分类绑定在一起，但是顺序总是不确定，会变动)  
举例：  
  ```js
  async function test() {
    let arr = [3, 2, 1];
    arr.forEach(async item => {
      const res = await handle(item);
      console.log(res);
    })
    console.log('end');
  }

  function handle(x) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(x);
      }, x * 1000);
    })
  }

  test();
  ```
  期望结果是 `3 -> 2 -> 1 -> end`  
  但实际结果 `end -> 1 -> 2 -> 3`  

## 问题原因  
forEach 底层的核心代码：  
  ```js
  for (var i = 0; i < length; i++) {
    if (i in array) {
      var element = array[i];
      callback(element, i, array);
    }
  }
  ```
  forEach 是拿到回调直接进行执行，无法保证异步任务的执行顺序，后面的任务可能会抢在前面执行  

## 解决方案  
  使用 for...of 可以解决  
  ```js
  async function test() {
    let arr = [3, 2, 1];
    for (const item of arr) {
      const res = await handle(item) ;
      console.log(res);
    }
    console.log('end');
  }
  ```

## 解决方案的原理 --- Iterator  
为什么 for...of 可以解决？？？  
for...of 并不像 forEach 那样拿到回调直接去执行，而是采用 `迭代器` 去遍历  
`原生具有[Symbol.iterator]属性的数据类型为可迭代数据，如数组、类数组、Set 和 Map等`  
举例：  
  ```js
  let arr = [1, 2, 3];
  let iterator = arr[Symbol.iterator]();
  ```
Iterator 的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是 ES6 创造了一种新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费

Iterator 的遍历过程是这样的:

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的 next 方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的 next 方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的 next 方法，直到它指向数据结构的结束位置。

每一次调用 next 方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含 value 和 done 两个属性的对象。其中，value 属性是当前成员的值，done 属性是一个布尔值，表示遍历是否结束。

