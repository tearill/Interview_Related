# 计算属性和监听属性  
## computed  
惰性计算  
dirty 属性是缓存的关键  
计算属性的初始化是发生在 Vue 实例初始化阶段的 initState 中  
`if (opts.computed) initComputed(vm, opts.computed)`  
### initComputed
src/core/instance/state.js  
- 首先创建 watchers 和 vm._computedWatchers 为一个空对象，用来存放所有计算属性相关的 watcher  
- 遍历 computed 对象(实例中定义的 computed)，拿到计算属性的每一个值作为 userDef，然后尝试获取这个 userDef 对应的 getter 函数，拿不到则在开发环境下报警告  
- 为每一个 key(也就是 computed 的属性) 创建一个 watcher，每一个都是一个 computed watcher，它的回调函数是 noop 为空  
- 最后判断如果 key 不是 vm 的属性，则调用 defineComputed(vm, key, userDef) 定义这个属性  
  如果 key 在 vm 中存在，说明是在 data 或者 props 中已经定义过而且重名了，则报警告  

### defineComputed  
利用 Object.defineProperty 给计算属性对应的 key 值添加 getter 和 setter  
访问 computed 属性的时候触发定义的 getter 逻辑  
- shouldCache = !isServerRendering()，在非服务端渲染的情况下会进行缓存  
- 判断如果 userDef 是一个 function，定义 get 和 set
  如果不是 function，从 userDef 上取到 get 和 set  
- 最后通过 Object.defineProperty 给计算属性对应的 key 值添加 getter 和 setter  

重点在 getter，computed 属性中 setter 的使用场景很少  
最终 getter 对应的是 createComputedGetter(key) 的返回值  
```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      if (watcher.dirty) { // 只有 dirty，也就是数据改变了才会求值
        watcher.evaluate()
      }
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```
dirty 这个概念代表脏数据，说明这个数据需要重新调用用户传入的函数来求值了  
第一次在模板中读取到数据的时候它一定是 true，所以初始化就会经历一次求值 => 调用 evaluate 方法  
```js
evaluate () {
  // 调用 get 函数求值
  this.value = this.get()
  // 把 dirty 标记为 false
  this.dirty = false
}
```
- 先求值，然后把 dirty 置为 false  
- 下次没有特殊情况再读取到相同值的时候，发现 dirty 是 false 了，就可以直接就返回 watcher.value 这个值，这就是计算属性缓存的概念  

### computed 属性的更新  
举例  
```js
computed: {
  sum() {
    return this.count + 1
  },
},
```
sum 为 computed 属性  
count 为依赖属性  
读取属性触发 getter，也就是 `createComputedGetter`  
- Dep.target 变更为 渲染watcher  
  当 dirty 为 true，调用 watcher.evaluate() => 进入 this.get() 方法 => 在读取模板变量的时候，全局的 Dep.target 是 渲染watcher  
  > 此时的 Dep.target 是 渲染watcher，targetStack 是 [ 渲染watcher ]  

  ```js
  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } finally {
      popTarget()
    }
    return value
  }
  ```
  精简逻辑后的 get，最开始进去的时候 pushTarget，也就是把 计算watcher 放入 targetStack 并置为 Dep.target 等待依赖收集  
  在执行完 pushTarget 之后  

- Dep.target 变更为 计算watcher  
  > 此时的 Dep.target 是 计算watcher，targetStack 是 [ 渲染watcher，计算watcher ]  
  在 computed 属性求值的过程中会触发它所依赖的响应式值的 getter  

  pushTarget 之后会执行到 value = this.getter.call(vm, vm) => 计算 computed 属性值 => 触发依赖属性的 getter 劫持  
  **getter 就是用户定义 computed 属性的时候传入的函数，执行的时候会触发依赖属性的 get 劫持**  
  ```js
  // 依赖属性的 getter => defineReactive 中定义的
  if (Dep.target) {
    dep.depend() // 依赖收集
    if (childOb) {
      childOb.dep.depend()
      if (Array.isArray(value)) {
        dependArray(value)
      }
    }
  }
  ```
  1. 此时的 Dep.target 是 计算watcher，也就会触发 dep.depend() 收集依赖  
  2. 触发 Dep.target.addDep() 调用 计算watcher 的 addDep  
  3. 执行 this.newDeps.push(dep) 使得 **计算watcher deps 中持有依赖属性的 dep**  
    执行 dep.addSub(this)，使得**依赖属性的 dep 中的 subs 持有 计算watcher**  
  **也就是计算属性的 watcher 和它所依赖的响应式值的 dep 相互保留了彼此**  

  > 这个过程也就是 computed 属性计算触发 getter => 触发 evaluate => 进入 get() 然后 pushTarget => 读取依赖属性的值 => 触发依赖属性的 getter => 触发 dep.depend => Dep.target.addDep 让 计算watcher 有了依赖属性 dep => 跑回让依赖属性 dep addSub 订阅 计算watcher  

- Dep.target 变更为 渲染watcher  
  上一步依赖的响应式属性求值结束后回到 get 中的 finally 执行 popTarget，计算watcher 出栈  
  > 此时的 Dep.target 是 渲染watcher，targetStack 是 [ 渲染watcher ]  

  执行完 get 方法之后得到两个值(依赖属性的 value 和 computed 属性的 value)  
  evaluate 执行结束，此时 computed 属性的 getter 还剩下一部分逻辑没有执行  
  ```js
  if (Dep.target) {
    watcher.depend()
  }
  return watcher.value
  ```
  此时的 Dep.target 为 渲染watcher，所以进入了 watcher.depend()  
  *注意：这里不再是 dep.depend()*  
  ```js
  depend () {
    let i = this.deps.length
    while (i--) {
      this.deps[i].depend()
    }
  }
  ```
  上一个步骤中，计算watcher 的 deps 中已经持有了依赖属性的 dep，所以这里会调用依赖属性的 dep 的 depend 方法  
  ```js
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  ```
  此时的 Dep.target 为 渲染watcher，Dep.target.addDep(this) 会去到 watcher 那边一日游，让渲染 watcher 持有自己，然后回来调用 addSub()，让依赖属性的 dep 的 subs 中持有 渲染watcher  
  之前 dep 的 subs 订阅者中已经有 计算watcher 了  
  > 此时依赖属性的 dep 的 subs 订阅者为：[ computed 属性的 计算watcher, 渲染watcher ]  

  此时依赖属性更新了，将会引起 computed 属性的更新，在依赖属性的 setter 中会触发依赖属性的 dep 的 notify  
  ```js
  notify () {
    // ... 省略拷贝和排序逻辑
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update() // 每个 watcher 的 update 更新
    }
  }
  ```
  此时会将依赖属性的 subs 中持有的 watcher 依次取出来调用它们的 update 方法，也就是  
  1. 计算watcher 的 update  
  2. 渲染watcher 的 update  

- 计算watcher 的 update  
  ```js
  update () {
    if (this.lazy) {
      this.dirty = true // 计算watcher 执行的逻辑
    }
  }
  ```
  将 dirty 设为 true，惰性求值，等待下次读取的时候进行更新  
- 渲染watcher 的 update  
  调用 vm._update(vm._render())，重新根据 render 函数生成的 vnode 去渲染视图，而在 render 的过程中，一定会访问到 computed 属性的值，又一次走到了 computed 属性的 getter  
  ```js
  function createComputedGetter (key) {
    return function computedGetter () {
      const watcher = this._computedWatchers && this._computedWatchers[key]
      if (watcher) {
        if (watcher.dirty) { // 只有 dirty，也就是数据改变了才会求值
          watcher.evaluate()
        }
        if (Dep.target) {
          watcher.depend()
        }
        return watcher.value
      }
    }
  }
  ```
  在 计算watcher 的 update 过程中已经把 dirty 设为 true 了，所以这里会去调用 evaluate(里面又把 dirty 改回 false 了) 根据传入的函数重新求值，页面上也就显示了最新的值  

  > 公用一个 Dep 和 Watcher 类，这样在通知更新的时候可以将两个 watcher 都通知到，本质是依赖的响应式属性的 notify 导致了 computed 属性的更新渲染  

## watch  
初始化同样是在 Vue 实例初始化阶段的 initState 中  
```js
if (opts.watch && opts.watch !== nativeWatch) {
  initWatch(vm, opts.watch)
}
```
initWatch 遍历所有的 watch，将每一个 watch 赋值给 handler  
- 如果 handler 是数组，遍历这个数组调用 createWatcher 方法  
- 如果不是数组，直接调用 createWatcher 方法  

### createWatcher  
- 首先对 hanlder 的类型做判断，拿到它最终的回调函数  
  - 如果是一个对象，handler 回调赋值为对象中 handler 属性  
  - 如果是一个字符串，handler 取 vm[handler]，也就是对应的 method
- 最终调用 vm.$watch(keyOrFn, handler, options)  

### vm.$watch  
$watch 是 Vue 原型上的方法，它是在执行 stateMixin 的时候定义的  
src/core/instance/state.js
- 如果传入的回调还是一个对象，调用 createWatcher 尝试把回调变成函数  
- options = options || {}  
- options.user = true => 说明 watcher 是一个 user watcher  
- 接着执行 const watcher = new Watcher(vm, expOrFn, cb, options) 实例化了一个 user watcher  
- 如果用户设置了 immediate 属性，直接先执行一次回调  
- 返回一个卸载销毁 watcher 的函数 teardown  

### new Watcher(user watcher)  
一旦 watch 的数据发生变化，它最终会执行 watcher 的 run 方法，执行回调函数 cb  
- 如果传入了 expOrFn 并且是一个函数，直接将其赋值成为 this.getter  
- 接着非 computed watcher 会执行 get() 方法  
- pushTarget 将 user watcher 放入 targetStack 中，并让 Dep.target 当前的 watcher 设置为当前的 user watcher  
- value = this.getter.call(vm, vm) 调用 getter 进行求值，依赖会被收集到 user watcher 中  

user watcher 在执行前会把自身置为 Dep.target，这时读取到监听的属性，就会把 user watcher 丢进被监听属性的依赖筐子 dep 里  

## 总结  
- computed 的本质是 computed watcher  
- watch 的本质是 user watcher  
- computed 适合用在模板渲染中，某个值依赖了其他响应式对象甚至是 computed 属性计算而来的  
- watch 适合用于观测某个值的变化去完成一段复杂业务逻辑  
