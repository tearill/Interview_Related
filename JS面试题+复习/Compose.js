// 手写实现一个 ompose 函数
// compose -> 接收多个函数作为参数，从右向左依次执行函数，并将前一个函数执行的结果作为下一个函数的输入

// 1. 接收函数作为参数
// 2. 将函数从右到左依次执行
// 3. 将上一个函数的输出结果作为下一个函数执行的输入参数 -> 记录每个函数的执行结果
// 4. 返回一个函数

function compose(...fn) { // 扩展出所有的函数参数 
  // console.log(fn);
  let len = fn.length; // 函数的个数
  let count = len - 1; // 最后一个函数(最右边)的下标
  let result;
  return function func(...args) {
    result = fn[count].apply(this, args); // 调用最右边的一个函数
    if (count > 0) { // 没有执行完，继续向左执行函数
      count--;
      return func.call(null, result); // 把前一个函数的输出作为下一个的输入
    } else {
      count = len - 1; // 把 count 复原
      return result; // 执行到最后一个函数返回结果
    }
  }
}

var greeting = (firstName, lastName) => 'hello, ' + firstName + ' ' + lastName
var toUpper = str => str.toUpperCase()
var fn = compose(toUpper, greeting)
console.log(fn('Horace', 'Cai'))
