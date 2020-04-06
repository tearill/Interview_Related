function myNew() {
  let obj = {}; // 生成一个新对象
  const Constructor = [].shift.call(arguments); // 拿到构造函数
  // 对象的 __proto__ = 函数的 prototype
  obj.__proto__ = Constructor.prototype; // 链接原型
  const ret = Constructor.apply(obj, arguments); // 绑定构造函数的 this 到新创建的对象
  return typeof ret === 'object' ? ret : obj;
}

function Foo(e) {
  this.name = "Horace";
  this.age = e;
}

console.log(myNew(Foo, 18));