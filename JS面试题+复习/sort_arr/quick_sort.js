// 快速排序(从小打到)
// 使用分治的思想把一个数组分成两个部分
// 1. 选择一个元素作为基准
// 2. 小于基准的元素，移动到基准的左边，大于基准的元素，移动到基准的右边
// 3. 对基准左右两边分好的两个部分，重复第一步和第二步，直到所有的子集只剩下一个元素为止

// 需要额外的空间用来储存左右子集
function quickSort(arr) {
  if (arr.length <= 1) return arr
  let pivotIndex = Math.floor(arr.length >> 1) // 数组中间元素的下标
  let pivot = arr.splice(pivotIndex, 1)[0] // 中间元素
  let left = [],
    right = []
  for (let i = 0; i < arr.length; i++) {
    let element = arr[i]
    if (element < pivot) {
      left.push(element)
    } else {
      right.push(element)
    }
  }
  return quickSort(left).concat([pivot], quickSort(right))
}

// 原地快速排序
function quickSortInPlace(arr) {
  // 交换元素
  function swap(arr, i, j) {
    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  function partition(arr, left, right) {
    let pivot = arr[left]
    let storeIndex = left

    for (let i = left + 1; i <= right; i++) {
      if (arr[i] < pivot) {
        swap(arr, ++storeIndex, i)
      }
    }
    swap(arr, left, storeIndex)
    return storeIndex
  }
  
  function sort(arr, left, right) {
    if (left < right) {
      let storeIndex = partition(arr, left, right)
      sort(arr, left, storeIndex - 1)
      sort(arr, storeIndex + 1, right)
    }
  }

  sort(arr, 0, arr.length - 1)
  return arr
}

console.log(quickSort([5, 8, 6, 3, 9, 2, 1, 7]))
console.log(quickSortInPlace([5, 8, 6, 3, 9, 2, 1, 7]))
