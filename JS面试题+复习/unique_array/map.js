// 数组去重
// map 实现
let arr = [3, 3, 1, 2, 1, 2, '1', '1'];

function unique(array) {
  let map = new Map();
  return array.filter(item => !map.has(item) && map.set(item, 1));
}

console.time('fun');
console.log(unique(arr));
console.timeEnd('fun');