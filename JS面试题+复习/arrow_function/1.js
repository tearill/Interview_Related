// 手写一个 new  两个版本 ES6 ES5
// ES5版本
var New = function(fn, ...args) {
  // ES6 的写法 Obeject.setPrototype
  const obj = Object.create(fn.prototype); // 直接指定原型
  // var obj = {}; // 最原始的状态，最顶部是一个对象
  // obj.__proto__ = fn.prototype; // 链接原型 对象的__proto__指向构造函数的 prototype
  const result = fn.call(obj, ...args); // 调用构造初始化
  return typeof result === 'object' ? result : obj; // 确保 new 出来的是一个对象
}

function Func1(name) {
  this.name = name;
}

var f1 = New(Func1);
console.log(f1 instanceof Func1);