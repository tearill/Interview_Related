Function.prototype.myApply = function(context, arr) {
  var context = context || window;
  context.fn = this; // 拿到调用 apply 的函数
  let result = eval('context.fn(arr)');
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
console.log('--------------------------------');
bar.myApply(foo, ['Horace', 18]); // Horace 18 1
console.log('--------------------------------');

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
console.log('--------------------------------');
console.log(baz.myApply(obj, ['Horace', 18]));