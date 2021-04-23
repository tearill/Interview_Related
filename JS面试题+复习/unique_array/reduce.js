// 去重
// reduce 实现
let arr = [3, 3, 1, 2, 1, 2, '1', '1'];

function unique(array) {
  return array.sort().reduce((res, cur) => {
    if (res.length === 0 || res[res.length - 1] !== cur) { // 结果最后一个和当前项
      res.push(cur);
    }
    return res;
  }, []); // 初始为空
}

console.time('fun');
console.log(unique(arr));
console.timeEnd('fun');