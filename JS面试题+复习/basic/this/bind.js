Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new Error('Function.prototype.bind - what is trying to bound is not callable');
  }
  var self = this; // 调用 bind 的函数
  // 获取 bind 里面的参数
  var args = Array.prototype.slice.call(arguments, 1);
  var FNOP = function() {}
  var innerFunc = function() { // 返回一个函数
    var bindArgs = Array.prototype.slice.call(arguments); // 获取传给 bind 返回的函数的参数
    // this instanceof innerFunc ? this : context 判断是不是通过 new 调用
    return self.apply(this instanceof innerFunc ? this : context, args.concat(bindArgs)); // 拼接参数并调用函数
  }
  FNOP.prototype = this.prototype;
  // innerFunc.prototype = this.prototype;
  innerFunc.prototype = new FNOP();
  return innerFunc;
}

const sum = (a, b, c) => {
  return a + b + c;
}

// console.log(sum(10, 10, 10));

let testSum = sum.bind(null, 10);
let sum10 = sum.myBind(null, 10);

console.log(testSum(10, 20));
console.log('-------------------');
console.log(sum10(10, 20));