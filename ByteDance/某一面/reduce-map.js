// 使用 reduce 实现 map 的功能
// 先定义一个数组
// 返回一个新数组
// reduce 实现

// age 年龄总数
const arr = [ {age: 10}, {age: 20}];
let sum = arr.reduce((acc, cur) => {
  // console.log(cur);
  return acc += cur.age;
}, 0)
// console.log(sum);

Function.prototype.myMap = function(cb) {
  // 返回一个新数组
  let res = [];
  return this.reduce((acc, current) => {
    // acc 初始为空数组
    // res.push(acc.call())
    let result = cb(current);
    return acc.concat(result);
  }, []); // 默认值空数组
  return res;
}

let sum2 = arr.reduce((acc, cur) => {
  // console.log(cur);
  return acc += cur.age;
}, 0);

console.log(sum2);