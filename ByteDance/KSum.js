// 用算法实现，从给定的无序、不重复的数组 data 中，取出 n 个数，使其相加和为 sum
// 并给出时间/空间复杂度(不需要找到所有的解，找到一个即可)

function getResult(data, n, sum) {
  let list = [];
  backtrack(data, list, n, sum);
  return list;
}

function backtrack(data, list, n, sum, tempList = [], start = 0) {
  if (tempList.length === n) {
    // n 个数，怎么已经够了
    if (tempList.reduce((a, b) => a + b, 0) === sum) {
      // 找到了符合要求的
      list.push(tempList);
    }
    return; // 退出当前递归
  }
  // tempList -> 已经做过的选择
  // for 枚举出每一步可以进行选择的列表
  for (let i = start; i < data.length; i++) {
    // 数组里面的每一项都要选择
    tempList.push(data[i]);
    // 之后的步骤，往后走一步
    backtrack(data, list, n, sum, tempList.slice(0), i + 1); // 从下一步开始选择
    // 撤销上一步选择
    // 循环完毕 pop 一次
    // return 回来回到上一次递归的时候会 pop 一次
    tempList.pop();
  }
}

console.log(getResult([1, 2, 3, 4, 5, 7], 3, 10));

/**
 * backtrack() {
 *  if () {
 *    终止条件
 *  } 
 *  for {
 *    选择
 *    backtrack()
 *    撤销掉选择
 *  }
 * }
 */