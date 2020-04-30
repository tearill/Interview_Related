// 冒泡排序(从小到大)
// 把相邻两个元素两两比较，当一个元素大于右侧相邻元素，交换位置
// 当一个元素小于或等于由于相邻元素，位置不变
// 时间复杂度：要遍历所有的元素，总共遍历 元素格式 - 1 轮 => 时间复杂度 O(n^2)
// 稳定排序 => 相等的元素位置不会变

function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      let temp
      if (arr[j] > arr[j + 1]) { // 前一项大于后一项 -> 交换位置
        temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

// 冒泡排序的优化
// 可能在经过一定次数的排序之后数组已经有序了
// 但是因为外层循环的控制排序还会继续，当遇到已经排好序的情况要提前退出循环
function bubbleSortBetter(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let isSorted = true // 每一轮初始为有序
    for (let j = 0; j < arr.length - i - 1; j++) {
      let temp
      if (arr[j] > arr[j + 1]) {
        temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
        // 如果有交换，说明不是有序的
        isSorted = false
      }
    }
    if (isSorted) { // 如果是有序的，退出循环
      break
    }
  }
  return arr
}

console.log(bubbleSort([5, 8, 6, 3, 9, 2, 1, 7]))
console.log(bubbleSortBetter([5, 8, 6, 3, 9, 2, 1, 7]))