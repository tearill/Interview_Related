const arr = [ {age: 10}, {age: 20} ];
const newArr = arr.map(e => {
  return {
    ...e,
    age: e.age * 2
  }
});
console.log(newArr, 'newArr');

function test(callback) {
  let str = 'Hello World';
  setTimeout(() => {
    callback.call(this, str);
  }, 2000);
}

// 2s 后输出 'Hello World' 完成 test
let str = 'Hello World';
test(function(str) {
  console.log(str);
})

// 铺垫
// for 循环实现 map 功能
Array.prototype.myMap = function(cb) {
  let res = [];
  for (let i = 0; i < this.length; i++) {
    res.push(cb(this[i]));
  }
  return res;
}

const newArr1 = arr.myMap(e => {
  return {
    ...e,
    age: e.age * 2
  }
})
console.log(newArr1, 'newArr1');
