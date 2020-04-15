// 去重
// 双指针 -> 快慢指针进行数组元素遍历  
// 快指针不停向后走，和慢指针位置的值判断是否相等，遇到不重复元素的时候停止，使用 splice(start, count) 删除中间重复的元素
let arr = [3, 3, 1, 2, 1, 2, '1', '1'];
let arr1 = [1, 2, 3, 3, 4, 4];

function unique(array) {
  const size = array.length;
  let slowP = 0;
  for (let fastP = 0; fastP < size; fastP++) {
    if (array[slowP] !== array[fastP]) {
      slowP++;
      array.splice(slowP, fastP - slowP);
      // array[slowP] = array[fastP];
    }
  }
  return array;
}

console.log(unique(arr));
console.log(unique(arr1));
// console.log(arr1.splice(0, 2)); // 3, 3