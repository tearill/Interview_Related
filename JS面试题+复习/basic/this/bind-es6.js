Function.prototype.myBind = function(context, ...arg1) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind - what is trying to bound is not callable');
  }
  let fn = this; // 拿到调用 bind 的函数
  function innerFunc(...arg2) { // 返回一个函数
    const args = arg1.concat(arg2); // 收集所有的参数
    if (this instanceof innerFunc) { // 如果是用 new 调用的
      return new fn(arg1, arg2);
    }
    return fn.apply(context, args);
  }
  return innerFunc;
}

const sum = (a, b, c) => {
  return a + b + c;
}

let testSum = sum.bind(null, 10);
let sum10 = sum.myBind(null, 10);

console.log(testSum(10, 20));
console.log('-------------------');
console.log(sum10(10, 20));