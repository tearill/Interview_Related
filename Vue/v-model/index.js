const a = {
  b: 1
}

function fn() {
  console.log('a 的值发生改变了', a.b)
}

function bindData() {
  Object.keys(a).map(key => {
    let v = a[key]
    Object.defineProperty(a, key, {
      enumerable: true,
      configurable: false,
      get() { // 读取属性调用的方法
        console.log('正在读取 a 里面的值')
        return v
      },
      set(newVal) { // 写入属性时调用的方法
        v = newVal
        fn()
      }
    })
  })
}

bindData()
// console.log(a.b)
a.b = 123
// console.log(a.b)