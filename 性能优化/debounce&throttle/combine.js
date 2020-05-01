// 加强版节流
// 防抖 + 节流
// 防抖有时候触发过于频繁会导致一次响应都没有，希望到了固定时间必须给用户一个响应

function throttle(fn, delay) {
  let last = 0,
    timer = null
  return function(...args) {
    let context = this
    let now = +new Date()
    if (now - last < delay) { // 还没到时间
      clearTimeout(timer)
      setTimeout(function() {
        last = now
        fn.apply(context, args)
      })
    } else {
      // 时间到了，一定要给一个响应
      last = now
      fn.apply(context, args)
    }
  }
}
