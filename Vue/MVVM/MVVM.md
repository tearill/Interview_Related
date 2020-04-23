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
  Watcher 的绑定时机  
  Dep.target  
  实现了数据修改更新视图  
- 实现一个代理 proxy  
  实现双向绑定 -> 实现视图修改更新数据 -> 更新对应的视图部分  

## 总体流程  
- 页面 index.html 数据准备  
- 打造一个入口 new myVue()，对数据、指令等进行初始化  
- 首先是页面解析，对数据、属性进行解析编译  
  - 创建一个编译器类 Compile 负责编译  
    Compile 编译的过程分为三个步骤：  
    + 创建文档碎片对象，放入内存中，会减少页面的回流和重绘  
      把所有的节点变成文档碎片，如果不用文档随便就会一直回流重绘，使用文档碎片在内存中修改，然后一次性插入 DOM 节点，只有一次回流重绘，提高性能  
      创建文档碎片对象使用循环遍历，每次取出第一项插入到文档碎片中，直到遍历完所有的层级  
    + 编译模板  
      编译模板可以分为几个大类：  
      1. 元素节点，也就是标签 例如：`<div v-text="msg"></div>`  
      2. 文本节点，向用户展示内容 例如：`<h3>{{ msg }}</h3>`  
            元素类型  | 节点类型  
            --------  | -------  
            元素      | 1  
            属性      | 2        
            文本      | 3    
            注释      | 8   
            文档      | 9   
      编译之前要先取出节点的所有属性，判断是不是 Vue 的指令，例如 v-html v-text v-model v-on 等等  
      判断之后进行响应的编译  
      使用一个 CompoileUtil 工具类真正实现模板的编译  
    + 追加子元素到根元素(插入渲染回 DOM 中去)  
      `this.el.appendChild(fragment);`  
- 现在已经实现了模板的初次渲染编译，要实现数据的响应式更新，必须有一个 Observer 对每一个数据进行监听，监听数据的变化  
- new Observer(this.$data); 创建观察者对 Vue 的数据进行统一监听  
- 实现 Observer 类  
  - 第一步是实现数据的劫持，能够知道数据的更新修改  
    使用 Object.defindProperty 的方式，对数据进行劫持监听  
  - data 必须是一个对象(实例化隔离)  
  ```js
  Object.keys(data).forEach(key => { // 每一个 key
    //! 调用劫持监听
    this.defineReactive(data, key, data[key]);
  })
  ```
  使用 Object.keys 遍历每一个数据的 key，保证深度监听  
  例如这样的数据：  
  ```js
  person {
    name: "Horace",
    age: 20
  }
  ```
  ```js
  //! 劫持监听
  defineReactive(obj, key, value) {
    // 递归遍历所有的属性，实现深度监听
    this.observer(value);
    const dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: false,
      get() {
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
  ```
- 数据劫持实现，接下来是在数据发生改变的时候要进行视图的更新渲染，是一个典型的**发布-订阅模式**  
  - 在数据初始化/编译的时候进行订阅者向 Dep(发布者，也就是容器)订阅 new Watcher  
  - Observer 通过 Object.defineProperty 的方式监听数据的改变，发生改变的时候通知发布者 Dep，发布者通知订阅者去更新(调用订阅者 Watcher 的 update 方法)  
- 在 new Watcher 的时候绑定一个回调，当调用 update 的时候，触发回调把新的数据值通过 callback 回调回去，再调用相应的模板编译工具函数进行视图的更新  
- 现在完成了数据改变触发视图更新渲染(单向绑定)，下一步是视图改变触发数据的更改，也就是完全实现数据的双向绑定  
- 数据代理，要实现可以通过 this.person.name 访问，而不是 this.$data.person.name  
  依旧使用 Object.defineProperty 实现  
  ```js
  proxyData(data) {
    for (const key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          data[key] = newVal;
        }
      })
    }
  }
  ```

## 面试题：阐述一下你所理解的 MVVM 响应式原理  
Vue 是采用数据劫持配合发布者-订阅者模式的方式，通过 Object.defineProperty() 来劫持各个属性的 setter 和 getter，在数据变动时发布消息给发布者(依赖收集器)，去通知订阅者，做出对应的回调函数，去更新视图  

MVVM 作为绑定的入口，整合了 Observer、Compile 和 Watcher 三者，通过 Observer 来监听 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起了 Observer 和 Compile 之间的通信桥梁，达到数据变化 -> 视图更新，视图交互变化 -> 数据 model 变更的双向绑定效果  