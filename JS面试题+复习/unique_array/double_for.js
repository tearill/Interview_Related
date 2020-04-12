// 数组去重 version1
// 双重循环 -> 使用一个新数组保存去重后的数组
let arr = [1, 1, '1', '1'];

function unique(array) {
  let res = []; // 去重后数组
  for (var i = 0, arrLen = array.length; i < arrLen; i++) {
    for (var j = 0, resLen = res.length; j < resLen; j++) {
      if (array[i] === res[j]) {
        break;
      }
    }
    if (j === resLen) { // array[i] 是唯一的，循环出来的 j 一定会等于 resLen
      res.push(array[i]);
    }
  }
  return res;
}

console.time('fun');
console.log(unique(arr));
console.timeEnd('fun');