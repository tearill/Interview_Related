// 去重
// 使用 filter 实现
let arr = [3, 3, 1, 2, 1, 2, '1', '1'];

function unique(array) {
  let res = array.filter((item, index, arr) => {
    return arr.indexOf(item) === index;
  });
  return res;
}

function sortUnique(array) {
  let res = array.sort().filter((item, index, arr) => {
    return !index || item !== arr[index - 1];
  })
  return res;
}

console.time('fun1');
console.log(unique(arr));
console.timeEnd('fun1');
console.time('fun2');
console.log(sortUnique(arr));
console.timeEnd('fun2');