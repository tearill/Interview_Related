// 数组去重 version2
// 使用一个新数组 + indexOf
let arr = [1, 1, '1', '1'];

function unique(array) {
  let res = [];
  for (let i = 0, arrLen = array.length; i < arrLen; i++) {
    const current = array[i];
    if (res.indexOf(current) === -1) { // 当另一个数组中不存在这个元素的时候才放进去
      res.push(current);
    }
  }
  return res;
}

console.time('fun');
console.log(unique(arr));
console.timeEnd('fun');