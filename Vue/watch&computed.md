# watch 和 computed 属性  
## 异同  
相同： computed 和 watch 都起到监听/依赖一个数据，并进行处理的作用  
异同：它们其实都是 Vue 对监听器的实现，只不过 computed 主要用于对同步数据的处理，watch 则主要用于观测某个值的变化去完成一段开销较大的复杂业务逻辑。能用 computed 的时候优先用 computed，避免了多个数据影响其中某个数据时多次调用watch的尴尬情况  

watch 的本质是一个 `user watcher`  
computed 的本质是一个 `computed watcher`  

计算属性适合用在模板渲染中，某个值是依赖了其它的响应式对象甚至是计算属性计算而来  
侦听属性适用于观测某个值的变化去完成一段复杂的业务逻辑  

不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化才会触发渲染 watcher 重新渲染(所谓的 computed 属性可以缓存)  
computed 属性最终会执行 getAndInvoke 函数进行新旧值的比较，如有变化才会执行回调函数，在其中 this.dep.notify() 通知 dep 发布者进行通知视图更新  
