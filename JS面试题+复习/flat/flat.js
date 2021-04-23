let result = []
let fn = function (arr) {
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    if (item instanceof Array) {
      fn(item)
    } else {
      result.push(item)
    }
  }
  return result
}

console.log(fn([[1, 2, 3], [4, 5]]))

// console.log(result)