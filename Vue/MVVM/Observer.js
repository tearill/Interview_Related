//! 订阅者
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm;
    this.expr = expr;
    this.cb = cb;
    // 先把旧值保存起来，与新值进行对比
    this.oldVal = this.getOldVal()
  }
  //! 取到 watcher 的旧值
  getOldVal() {
    Dep.target = this; // 指向当前的 watcher
    const oldVal = compileUtil.getValue(this.expr, this.vm);
    Dep.target = null; // 拿到值之后销毁，方便定义下一个 watcher
    return oldVal;
  }
  //! 更新视图
  update() {
    const newVal = compileUtil.getValue(this.expr, this.vm);
    if (newVal !== this.oldVal) {
      this.cb(newVal);
    }
  }
}

//! 发布订阅者模式
class Dep {
  constructor() {
    this.subs = []; // watcher 订阅者
  }
  //! 收集订阅者 watcher
  addSub(watcher) {
    this.subs.push(watcher);
  }
  //! 通知订阅者更新
  notify() {
    console.log('通知了订阅者', this.subs);
    this.subs.forEach(watcher => watcher.update())
  }
}

//! 实现属性监听
class Observer {
  constructor(data) {
    this.observer(data);
  }

  observer(data) {
    /*
      {
        person: {
          name: '张三',
          fav: {
            a: '爱好'
          }
        }
      }
     */
    if (data && typeof data === 'object') {
      // console.log(Object.keys(data)); // 最外层的
      Object.keys(data).forEach(key => { // 每一个 key
        //! 调用劫持监听
        this.defineReactive(data, key, data[key]);
      })
    }
  }
  //! 劫持监听
  defineReactive(obj, key, value) {
    // 递归遍历所有的属性，实现深度监听
    this.observer(value);
    const dep = new Dep();
    // 劫持并监听所有的属性
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
        // 初始化
        // 订阅数据变化时，往 Dep 中添加观察者
        Dep.target && dep.addSub(Dep.target);
        return value;
      },
      set: (newVal) => { // 改成箭头函数保证 this 指向
        this.observer(newVal); // 劫持新的值
        if (newVal !== value) {
          value = newVal;
          // 告诉 Dep 通知变化
          dep.notify();
        }
      }
    })
  }
}