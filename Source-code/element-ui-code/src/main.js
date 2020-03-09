import Vue from 'vue'
import App from './App.vue'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入组件 它们将变成全局组件
import Carousel from './components/carousel/index.js'
import CarouselItem from './components/carousel-item/index.js'
console.log(Carousel)
// Carousel.install(Vue)
// CarouselItem.install(Vue)
Vue.use(Carousel)
Vue.use(CarouselItem)
// Vue.component(Carousel.name, Carousel)
// 放到一个组件数组里
// const components = [
//   Carousel,
//   CarouselItem
// ]
// 给组件注册 install 方法
// const install = function(Vue) {
//   components.forEach(component => {
//     console.log(component)
    // Vue.component 全局注册一遍组件
//     Vue.component(component.name, component)
//   })
// }

// Vue.use 会调用对象的 install 方法
// install(Vue) // 安装一下组件

// Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
