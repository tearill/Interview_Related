Function.prototype.myApply = function(context, arr) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = Object(context) || window;
  context.fn = this; // 拿到调用 apply 的函数
  let result
  if (!arr) {
    result = context.fn();
  } else {
    result = context.fn(...arr);
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