Function.prototype.myApply = function(context, arr) {
  var context = Object(context) || window; // 当传入的 this 参数为 null 的时候指向 window
  context.fn = this; // 拿到调用 apply 的那个函数
  var result;
  if (!arr) {
    result = context.fn(); // 如果不带参数，直接执行
  } else {
    var args = [];
    for (let i = 0, len = arr.length; i < len; i++) {
      args.push('arr[' + i + ']');
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

bar.apply(foo);
bar.myApply(foo); // undefined undefined 1
console.log('--------------------');

bar.apply(foo, ['Horace', 18]);
bar.myApply(foo, ['Horace', 18]); // Horace 18 1
console.log('--------------------');

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

baz.apply(null);
baz.myApply(null);
console.log('--------------------')

console.log(baz.apply(obj, ['Horace', 18]))
console.log(baz.myApply(obj, ['Horace', 18]));
