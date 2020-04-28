# Vue 和 React 的区别  
## 相同点  
1. 数据驱动页面，提供响应式的视图组件  
2. 都有 Virtual DOM，组件化的开发，通过 props 参数进行父子组件之间的数据传递，都实现了 webComponents 规范  
3. 都支持服务器端渲染  
4. 都有支持 native 的方案，React 的 React native，Vue 的 weex

## 不同点  
1. Vue API 是美好的，就像初恋的浪漫  
  React 风格是一切皆编程语法，JS 原始编程，西部牛仔  
2. Virtual DOM 不一样，Vue 会跟踪每一个组件的依赖关系，不需要重新渲染整个组件树，而对于 React而言，每当应用的状态被改变时，全部组件都会重新渲染，所以 React 中会需要 shouldComponentUpdate 这个生命周期函数方法来进行控制  
3. 组件写法不一样  
  React 推荐的做法是 JSX + inline style, 也就是把 HTML 和 CSS 全都写进 JavaScript 了，即'all in js'  
  Vue 推荐的做法是 webpack + vue-loader 的单文件组件格式，即 html、css、js 写在同一个文件但是会区分开标签  
4. 数据绑定: Vue 实现了数据的双向绑定，React 数据流动是单向的(props 只读)  