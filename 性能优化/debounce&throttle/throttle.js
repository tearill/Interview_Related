// 节流
// 如果在规定的时间间隔内二次触发事件，不理睬二次触发的操作，必须等当前的定时器完成之后再去执行下一个
// 规定的事件内只会执行一次操作，如果触发多次，只有一次生效
// 举例：公交车十分钟一趟，十分钟内有多人在车站我不管，十分钟一到就直接发车走人
// 举例：游戏里面的技能冷却，放了技能，进入冷却，期间就算不停地点技能，也放不了，
// 只能等冷却好，才可以再放
// 场景：拖拽、resize、动画、滚动事件

// 定时器间隔实现
function throttle(fn, interval) {
  let flag = true
  return function(...args) {
    let context = this
    if (!flag) return // 之前触发了，没有执行权限
    flag = false // 一旦触发一次就锁定权限
    setTimeout(() => {
      fn.apply(context, args)
      flag = true // 执行完之后放开权限
    }, interval)
  }
}

// 时间计算实现
function throttle_date(fn, interval) {
  let last = 0
  return function(...args) {
    let context = this
    let now = +new Date()
    if (now - last < interval) return // 规定时间内再次触发了
    last = now
    fn.apply(context, args)
  }
}
