// 选择排序(从小到大)
// 首先在未排序序列中找到最小值，放在排序序列的起始位置
// 然后，在从剩下未排序元素中继续寻找最小值，然后放在已排序序列的末尾
// 时间复杂度：O(n^2) 
// 一共经历了 n + n-1 + n-2 + … + 2 + 1 = n * (n+1) / 2 = 0.5 * n ^ 2 + 0.5 * n

function selectSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i // 初始化最小值为未排序元素中的第一个
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) { // 从剩下的元素中找到最小值
        min = j
      }
    }
    if (min !== i) { // 最小值下标变化了，说明要进行交换
      let temp = arr[min]
      arr[min] = arr[i]
      arr[i] = temp
    }
  }
  return arr
}

console.log(selectSort([5, 8, 6, 3, 9, 2, 1, 7]))