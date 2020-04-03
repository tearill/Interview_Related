const sum = (a, b, c) => {
  return a + b + c;
}
console.log(sum(10, 10, 10));
// 参数不够 只有一个参数
let sum10 = sum.bind(null, 10);
// 接着传剩下的两个参数
console.log(sum10(10, 20));

Function.prototype.myBind = function (thisObj, ...arg1) {
  let fn = this;;
  function innerFunc(...arg2) {
    const args = arg1.concat(arg2);
    fn.apply(thisObj, ...args);
  }
  return innerFunc;
}