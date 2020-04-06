Function.prototype.myBind = function(context, ...arg1) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind - what is trying to bound is not callable');
  }
  let fn = this; // 拿到调用 bind 的函数
  var FNOP = function() {}
  function innerFunc(...arg2) {
    const args = arg1.concat(arg2); // 收集所有的参数
    let isNewCall = this instanceof innerFunc;
    return fn.call(isNewCall ? this : context, ...args); // 调用函数
  }
  FNOP.prototype = this.prototype;
  // innerFunc.prototype = fn.prototype; // 链接原型
  innerFunc.prototype = new FNOP();
  return innerFunc;
}

const sum = (a, b, c) => {
  return a + b + c;
}
console.log(sum(10, 10, 10));
let sum10 = sum.myBind(null, 10);
console.log(sum10(10, 20));