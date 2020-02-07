import Vue from 'vue'
import App from './App.vue'
// 引入element-ui的标准动作
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入样式
Vue.use(ElementUI) // 全局注册组件库

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
