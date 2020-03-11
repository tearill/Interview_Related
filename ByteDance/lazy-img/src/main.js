import Vue from 'vue'
import App from './App.vue'

// 两个性能优化  
// lazyload
// click
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  // CommonJS
  error: require('./assets/loading.svg'), // error
  loading: require('./assets/loading.svg'), // 加载中
  attempt: 1 // viewport 视窗
})

Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
