# MVVM 原理  
## 几种实现双向绑定的做法  
实现数据绑定的做法主要有：  
1. 发布者-订阅者模式：通过 sub、pub 的方式实现数据和视图的绑定监听，更新数据一般使用 vm.set('property', value)  
2. 脏值检查：通过脏值检查测方式比对数据是否变更，决定是否更新视图  
3. 数据劫持：采用数据劫持结合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的 setter、getter，在数据变动的时候发布消息给订阅者，触发相应的监听回调  

- 实现一个指令解析器 Compile  
  对传进来的东西扫描解析  
- 实现一个数据监听器 Observer 劫持监听所有属性  
  Object.defineProperty()  
- 实现一个 watcher 更新视图  
- 实现一个代理 proxy  