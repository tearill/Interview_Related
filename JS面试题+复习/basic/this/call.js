Function.prototype.myCall = function(context) { // context 是要绑定的 this 
  var context = context || window; // 当传入的 this 参数为 null 的时候指向 window
  context.fn = this;// 获取调用 call 的函数，在那个 conext 对象上去添加方法
  // console.log(this, '--------------');
  let args = []; // 参数
  for (let i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']'); // 每一个参数
  }
  // context.fn(); // 执行这个函数
  // eval('context.fn(' + args + ')'); // 带上参数执行这个函数
  let result;
  if (!args) { // 如果不带参数
    result = context.fn();
  } else { // 带了参数
    result = eval('context.fn(' + args + ')'); // 保存返回值
  }
  delete context.fn; // 从对象中删除这个函数
  return result; // 返回函数运行的结果
}

let foo = {
  value: 1
};

function bar(name, age) {
  console.log(name);
  console.log(age);
  console.log(this.value);
}
bar.myCall(foo); // 1
bar.myCall(foo, 'Horace', 18); // Horace 18 1

var value = 2;
let obj = {
  value: 1
}

function baz(name, age) {
  console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age
  };
}

baz.myCall(null);
console.log(baz.myCall(obj, 'Horace', 18));