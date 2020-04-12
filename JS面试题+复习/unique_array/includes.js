// 去重
// includes 实现
let arr = [3, 3, 1, 2, 1, 2, '1', '1'];

function unique(array) {
  let res = [];
  array.forEach(item => {
    if (!res.includes(item)) {
      res.push(item);
    }
  })
  return res;
}

console.time('fun');
console.log(unique(arr));
console.timeEnd('fun');