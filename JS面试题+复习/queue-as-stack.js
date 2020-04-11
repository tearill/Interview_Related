// 队列模拟实现栈的实现
// 两个队列模拟栈？栈 -> 先进后出 队列 -> 先进先出
//! 出栈的时候应该实现出栈刚入栈的元素
// 可以在 push 之前，利用另一个队列，将当前队列清空，然后 push 元素，再将另一个队列的元素 push 回来
// 1. 新元素入栈：放进不为空的那个队列中去
// 2. 元素出栈：把不为空的那个队列中前 n-1 个元素出队放到另一个队列里，剩下一个元素(最后进入的元素)，然后把剩下的那个元素出队
//! 注意转移的顺序，要使用 shift 从头开始转移，不能从尾部转移

let queue1 = [];
let queue2 = [];

function inStack() {
  console.log(arguments, '----in');
  // 保持一个为空一个非空
  if (queue1.length !== 0) { // 放进不为空的，如果都为空，默认放到 queue2
    queue1.push(...arguments);
  } else {
    queue2.push(...arguments);
  }
}

function outStack() {
  if (queue1.length === 0 && queue2.length === 0) return undefined;
  if (queue1.length !== 0) { // 谁不为空就把谁里面前 n-1 个元素取出来放到另一个里面
    let len = queue1.length;
    while(len > 1) {
      queue2.push(queue1.shift()); // 转移前 n-1 个元素
      len--;
    }
    let res = queue1.pop(); // 把剩下的那个移出队列(最后加进去的那个元素)，相当于出栈
    return res;
  } else {
    let len = queue2.length;
    while(len > 1) {
      queue1.push(queue2.shift());
      len--;
    }
    let res = queue2.pop();
    return res;
  }
}

inStack(1);
inStack(2);
inStack(3);
console.log(queue1.length !== 0 ? queue1 : queue2, '首次入队三个元素之后');
console.log(outStack(), '-----out');
console.log(outStack(), '-----out');
inStack(4);
console.log(queue1.length !== 0 ? queue1 : queue2, '中途扒拉进一个元素');
inStack(5);
console.log(queue1.length !== 0 ? queue1 : queue2, '我再扒拉进一个元素');
console.log(outStack(), '-----out');
console.log(queue1.length !== 0 ? queue1 : queue2, '出栈之后剩下元素');