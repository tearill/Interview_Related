// 数组去重
// Object 键值对实现
// 使用一个空的对象，把数组的值存成对象的 key，后续元素判断 key 是否存在
let arr = [3, 3, 1, 2, 1, 2, '1', '1'];

function unique(array) {
  let obj = {};
  return array.filter((item) => { // item + item 避免把 1 和 '1' 判断成同一个值
    return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true);
  });
}

function unique2(array) {
  let obj = {};
  let res = [];
  for (let i = 0, len = array.length; i < len; i++) {
    const item = array[i];
    if (!obj[typeof item + JSON.stringify(item)]) { // 如果该 key 在对象中不存在
      obj[typeof item + JSON.stringify(item)] = 1;
      res.push(item);
    }
  }
  return res;
}

console.time('fun');
console.log(unique(arr));
console.timeEnd('fun');
console.time('fun2');
console.log(unique2(arr));
console.timeEnd('fun2');