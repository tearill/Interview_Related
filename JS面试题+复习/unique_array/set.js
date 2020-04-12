// 数组去重
// set 实现
let arr = [3, 3, 1, 2, 1, 2, '1', '1'];

function unique(array) {
  // return Array.from(new Set(array));
  return [...new Set(array)];
}

console.time('fun');
console.log(unique(arr));
console.timeEnd('fun');