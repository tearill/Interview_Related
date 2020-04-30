// 插入排序(从小到大)
// 将第一个元素视为有序序列，遍历数组，将之后的元素依次插入这个构建的有序序列中
// 1. 从第一个元素开始，讲第一个元素视为有序
// 2. 取出下一个元素，在已排序的元素中从后向前扫描
// 3. 如果有序序列中的元素大于新元素，把该元素向后挪一个位置

function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j + 1] < arr[j]) {
        temp = arr[j + 1]
        arr[j + 1] = arr[j]
        arr[j] = temp
      } else {
        break
      }
    }
  }
  return arr
}

console.log(insertionSort([5, 8, 6, 3, 9, 2, 1, 7]))
