// 使用栈模拟队列的实现
// 思路：两个栈 栈 -> 先进后出 队列 -> 先进先出
// 一个栈负责入队，一个栈负责出队
// 1. 当有新元素入队的时候，push 到第一个栈里面
// 2. 当于元素要出队的时候，由于栈是先进后出，要把入队的栈里的元素依次取出放到另一个栈内然后再 pop 出栈实现队列的出队
// 3. 如果没有全部出队，未出队的元素就直接留下在出队栈中，如果已经完全出队还想再出队，就继续从入队栈中取全部元素依次入另一个栈

let inStack = []; // 入队栈
let outStack = []; // 出队栈

function inQueue() { // 入队操作
  inStack.push(...arguments);
}

function outQueue() {
  if (outStack.length === 0) { // 如果出队栈已经空了，就去从入队栈里把所有元素取出来
    while(inStack.length) {
      // const element = inStack.pop(); 
      // console.log(inStack, '++++in');
      // console.log(element, '-------');
      // console.log(inStack.pop(), '--------');
      outStack.push(inStack.pop()); // 转移
    }
  }
  if (outStack.length === 0 && inStack.length === 0) return undefined; // 两个栈都为空的时候出队，直接返回 null
  // 出队栈中有元素，直接 pop 出队
  let res = outStack.pop();
  return res;
}

// 测试
// let queue = [];
inQueue(1);
inQueue(2);
inQueue(3);
console.log(inStack);
// console.log(outStack);
// outQueue();
console.log(outQueue(), '出队一个');
console.log(outStack, '出队一次之后');
inQueue(4);
console.log(inStack, '中途进队一个');
console.log(outQueue(), '出队两个');
console.log(outQueue(), '出队三个');
console.log(outQueue(), 'When stack is empty');
console.log(inStack, '-----inStack');
console.log(outStack, '-----outStack');

// let stack = [1];
// stack.pop();
// console.log(stack.pop(), '++++++++++++');