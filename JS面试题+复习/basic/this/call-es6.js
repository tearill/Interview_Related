Function.prototype.myCall = function(context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = Object(context) || window; // 传递的 this 指向为 null 的时候指向 window
  // let fn = new Symbol('fn');
  context.fn = this; // 获取调用 call 的函数，在那个 conext 对象上去添加方法
  let result = context.fn(args);
  delete context.fn;
  return result;
}

let foo = {
  value: 1
};

function bar(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}
bar.call(foo);
bar.myCall(foo); // 1
console.log('--------------');

bar.call(foo, 'Horace', 18)
bar.myCall(foo, 'Horace', 18); // Horace 18 1
console.log('--------------');

var value = 2;
let obj = {
  value: 1
}

function baz(name, age) {
  // console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age
  };
}

baz.call(null);
baz.myCall(null);
console.log('--------------')

console.log(baz.call(obj, 'Horace', 18));
console.log(baz.myCall(obj, 'Horace', 18));