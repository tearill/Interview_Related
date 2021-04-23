# nextTick  
数据变化到 DOM 的变化是异步的过程  

## JS 运行机制  
JS 的执行是单线程的，它是基于事件循环 Event Loop 的  
- 事件循环的步骤  
  1. 所有同步任务在主线程上执行，形成执行栈  
  2. 主线程之外还有一个任务队列，只要异步任务有了运行结果，就放到任务队列中(回调还未执行)  
  3. 一旦执行站中所有的同步任务执行完毕，就会去读取任务队列，对应的任务队列中的事件进入执行栈执行  
  4. 重复这个过程  
- 主线程的执行过程就是一个 tick，而所有的异步结果都是通过 “任务队列” 来调度，消息队列中存放的是一个个的任务（task），task 分为两大macroTimerFunc 的实现：setImmediate || MessageChannel || setTimeout  分别是 macro task 和 micro task，每个 macro task 结束后，都要清空所有的 micro task  

## Vue 中 nextTick 的实现  
src/core/util/next-tick.js  
### 2.5 版本的实现  
在 Vue 2.5 中，nextTick 的实现是 microTimerFunc、macroTimerFunc 组合实现的  
2.5 版本代码加在 src/core/util/next-tick2.5.js  
- 定义了 microTimerFunc 和 macroTimerFunc 2 个变量，它们分别对应的是 micro task 的函数和 macro task 的函数  
- macroTimerFunc 的实现：setImmediate || MessageChannel || setTimeout => 依次降级兼容  
- microTimerFunc 的实现：原生的 Promise => 如果没有 Promise 就 fallback to macro，降级为 macroTimerFunc 处理  
- 2.5 版本的 nextTick 向外暴露了两个方法：nextTick 和 withMacroTask  
  - nextTick  
    nextTick(flushSchedulerQueue) 中使用的方法，将传入的回调 cb 压入 callbacks 数组，最后一次性根据 useMacroTask 条件执行 macroTimerFunc 或者是 microTimerFunc，不管是执行哪一个都是在下一个 tick 执行 flushCallbacks(遍历 callbacks，执行相应的回调)  
  - withMacroTask  
    对函数做一层包装，确保函数执行过程中对数据任意的修改，触发变化执行 nextTick 的时候强制走 macroTimerFunc。比如对于一些 DOM 交互事件，如 v-on 绑定的事件回调函数的处理，会强制走 macro task  

### 2.6 版本的实现  
在 Vue 2.6 版本中使用 microtasks 代替之前的解决方案  
```
Here we have async deferring wrappers using microtasks.
In 2.5 we used (macro) tasks (in combination with microtasks).
However, it has subtle problems when state is changed right before repaint
(e.g. #6813, out-in transitions).
Also, using (macro) tasks in event handler would cause some weird behaviors
that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
So we now use microtasks everywhere, again.
A major drawback of this tradeoff is that there are some scenarios
where microtasks have too high a priority and fire in between supposedly
sequential events (e.g. #4521, #6690, which have workarounds)
or even between bubbling of the same event (#6566).
```
- 改用 microtasks 方案的原因  
  1. 在重绘之前状态发生改变会有轻微的问题，本质上就是在 css 中定义了 @media 媒体查询，js 中 window 监听了 resize 事件，那么当触发固定阈值时，state 发生了变化、样式也需要重绘，这就产生了问题 => 对应 issue https://github.com/vuejs/vue/issues/7109  
  > 实例：https://codepen.io/ericcirone/pen/pWOrMB  
    当缩小到 1000px 以下的时候本应该隐藏列表但是列表会先闪烁垂直再隐藏，因为在 CSS 中 @media 媒体查询小于 1000px 的时候设置了 inline-block，v-show 的执行比 CSS 更慢了  
  2. 利用 macro task 处理事件时，会产生一系列无法规避的诡异问题，一般可以概括为由于使用 macroTask 处理 DOM 操作，会使得有些时候触发和执行之间间隔太大，例如在移动端，单击的 handler 和音频播放功能不在同一 tick 里  
- 统一的 timerFunc 代替 macroTimerFunc 和 microTimerFunc  
- 使用 promise.then 以及 Mutation observers，并添加 setImmediate 、setTimeout，作为降级方案  
- 这种实现方法解决了上述问题，但是也有一个很明显的弊端。由于 microTask 的优先级太高，导致当连续触发 event 事件时产生问题  

## 总结  
- nextTick 是把要执行的任务放入一个队列中，在下一个 tick 同步执行  
- 数据改变后触发渲染 watcher 的 update，但是 watcher 的 flush 刷新是在 nextTick 后，所以重新渲染是异步的  
- 平时在开发的过程中，比如从服务端接口去获取数据的时候，数据做了修改，如果我们的某些方法去依赖了数据修改后的 DOM 变化，我们就必须在 nextTick 后执行  
