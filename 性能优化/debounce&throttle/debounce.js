// 防抖
// 每次事件触发则删除原来的定时器，建立新的定时器
// 无论事件触发多少次，我都只执行最后一次的操作
// 举例：提供一个按钮供你查询你未来对象的样子，无论你点击查询多少次，都只会在你最后一次点击之后查询
// 举例：王者荣耀的回城功能，反复触发回城，只会确认最后一次，从最后一次触发开始计时
// 场景：提交按钮、搜索词联想

// 定时器 timer 实现
function debounce(fn, delay) {
  let timer = null
  return function(...args) {
    let context = this
    if (timer) clearTimeout(timer) // 如果已经触发了事件，再次点击的时候清空定时器
    timer = setTimeout(function() { // 设置定时器
      fn.apply(context, args) // 操作包裹起来
    }, delay)
  }
}

// 时间计算实现
function debounce_date(fn, delay = 1000, immediate = true) {
  let last = Date.now()
  return function(...args) {
    let context = this
    if (immediate) {
      fn.apply(context, args)
      immediate = false
    } else if (Date.now() - last > delay) {
      fn.apply(context, args)
    }
    last = Date.now()
  }
}
