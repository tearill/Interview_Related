function myNew(obj, ...args) {
  // let newObj = {}; // 生成一个新对象
  // const Constructor = [].shift.call(arguments); // 拿到构造函数
  // 对象的 __proto__ = 函数的 prototype
  // newObj.__proto__ = obj.prototype; // 链接原型
  if (typeof obj !== 'function') {
    throw new Error('new function, the first parameter must be a function')
  }
  let newObj = Object.create(obj.prototype);
  const ret = obj.apply(newObj, args); // 绑定构造函数的 this 到新创建的对象
  return typeof ret === 'object' ? ret : obj;
}

function Foo(e) {
  this.name = "Horace";
  this.age = e;
}

let newFoo = myNew(Foo, 18)
console.log(newFoo);