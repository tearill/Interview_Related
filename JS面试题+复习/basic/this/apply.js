Function.prototype.myApply = function(context, arr) {
  var context = context || window; // 当传入的 this 参数为 null 的时候指向 window
  context.fn = this; // 拿到调用 apply 的那个函数
  let result;
  if (!arr) {
    result = context.fn(); // 如果不带参数，直接执行
  } else {
    let args = [];
    for (let i = 1, len = arr.length; i < len; i++) {
      args.push('arguments[' + i + ']');
    }
    result = eval('context.fn(' + args + ')');
  }
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
bar.myApply(foo); // 1
bar.myApply(foo, ['Horace', 18]); // Horace 18 1

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

baz.myApply(null);
console.log(baz.myApply(obj, ['Horace', 18]));