let arr = [2, 1, 0, 4, 3];

function bubbleSort(arr) {
  if (!arr) return;
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    let isSort = true;
    for (let j = 0; j < len - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        isSort = false;
      }
    }
    if (isSort) {
      break;
    }
  }
  return arr;
}

console.log(bubbleSort(arr));
