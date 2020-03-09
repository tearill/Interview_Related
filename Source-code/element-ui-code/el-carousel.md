# Element-ui 源码分析  

## `<el-carousel>` 组件  

- 怎么使用 Element-ui  
  import ElementUI from 'element-ui'  
  Vue.use(ElementUI)  
  所有的组件可全局使用  
  - Vue.use 背后做的事情  
  - 只需要使用部分组件：  
    按需引用，项目中用不到所有的组件， JS 越少，项目运行越快  

- 每个组件都是一个目录  
  carousel 组件，设计成了一个父子组件，各司其职  
  carousel-item 组件内部的  
  划分职责:  
  容器组件，包裹 carousel-item，负责控制 横向|竖向 滚动 + @change + interval  
  子组件 slot  

- Element-ui 组件开发  
  一个组件像一个项目一样去开发  
  
- 源码学习方式  
  把组件开发分成很多个小目标  
  适时地忽略一些部分，先完成大体实现(必需的东西)，再完善细节(附加的东西)  

## 分析  

- name 属性不可缺少，非常有用  

- 按需引入组件/把组件注册成全局可复用的组件(main.js中引入)  
  Vue.use() 的实质是调用插件上的 install 方法，需要将 Vue 实例作为参数传递进去  
  步骤：  
  1. 给组件封装 install 方法  
     在 component/carousel/index.js 中给组件封装方法并导出  
     ```js
     import Carousel from './src/main'

     Carousel.install = function(Vue) {
       Vue.component(Carousel.name, Carousel)
     }

     export default Carousel
     ```  
  2. 在根目录 main.js 中引入组件并在 Vue 上注册安装这个插件  
     可以使用 Vue.use() 来实现
     ```js
     import Carousel from './components/carousel/index.js'
     Vue.use(Carousel)
     ```  
     也可以通过调用插件的 install 方法来实现  
     ```js
     Carousel.install(Vue)
     ```

- carousel 中 indicators 的个数问题  
  不使用传参 props 的方式实现 --- 很麻烦  
  应该根据 carousel-item 的数量来动态决定 indicators 的个数  
  解决方案：  
  1. 在 carousel-item 组件中通知父组件"更新"数量  
     每创建一个 carousel-item 组件，就要通知 carousel 组件去更新增加一个 indicators  
     在 carousel-item 组件的 created 生命周期中通知父组件(同时要判断 carousel-item 是不是作为 carousel 的子组件出现的)  
     ```js
     created() { // 放在 created 中处理可以更快的更新
      console.log(this.$parent)
      // 如果是放在 carousel 之中出现的 
      // if (this.$parent) {}
      this.$parent && this.$parent.updateItems() // 通知父组件增加一项
     }
     ```
     不使用 $emit，使用 $emit 需要在父组件添加接受，这里只需要通知父组件更新就好了  
     使用 $parent 拿到父组件，调用父组件的 updateItems 方法更新一下数量  
     + 判断条件书写小技巧：  
       如果判断条件只有一个，可以用逻辑与运算符 && 写成一条语句  
  2. 在父组件 carousel 中定义相应的 uodateItems 方法用于更新数量  
     ```js
     updateItems() { // 通过子组件的创建来更新循环(轮播图的indicator)数量
      console.log(this.$children) // 所有的子组件
      // 去除掉组件中不是 carousal-item 的部分
      this.items = this.$children.filter(child => child.$options.name === 'CarouselItem')
     }
     ```
     父组件通过 $children 拿到所有的子组件，同时要注意过滤掉那些不是 carousel-item 的子组件  