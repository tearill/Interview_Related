// 去重 version3
// 排序后去重 -> 只需要比较排好序的数组中的前后项是否相等 -> 不相等就加进结果数组
let arr = [3, 3, 1, 2, 1, 2, '1', '1'];

function unique(array) {
  let res = [];
  let sortedArr = array.sort();
  // console.log(sortedArr);
  for (let i = 0, len = sortedArr.length; i < len; i++) {
    if (sortedArr[i] !== sortedArr[i + 1]) { // 前后项判断
      res.push(sortedArr[i]);
    }
  }
  return res;
}

// sort 版本去重优化
function betterUnique(array) {
  let res = [];
  let sortedArr = array.sort();
  for (let i = 0, len = sortedArr.length; i < len; i++) {
    if (sortedArr[i] !== res[res.length - 1]) { // 和已经确定的数组进行判断
      res.push(sortedArr[i]);
    }
  }
  return res;
}

function uniqueSeen(array) {
  let res = [];
  let sortedArr = array.sort();
  let seen;
  for (let i = 0, len = sortedArr.length; i < len; i++) {
    if (!i || seen !== sortedArr[i]) {
      res.push(sortedArr[i]);
    }
    seen = sortedArr[i];
  }
  return res;
}

console.time('fun1');
console.log(unique(arr));
console.timeEnd('fun1');
console.time('fun2');
console.log(betterUnique(arr));
console.timeEnd('fun2');
console.time('fun3');
console.log(uniqueSeen(arr));
console.timeEnd('fun3');