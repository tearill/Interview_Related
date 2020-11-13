// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import router from './router'

// Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })

var app = new Vue({
  el: '#app',
  // render 函数会替换
  render(createElement) {
    return createElement('div', {
      attrs: {
        id: 'app',
      }
    }, this.message);
  },
  beforeCreate() {
    // console.log(this.$options);
  },
  mounted() {
    // console.log(this.message);
    // console.log(this._data.message, '----');
    console.log(this._data);
  },
  data() {
    return {
      message: 'new Vue'
    }
  }
})

// var app = new Vue({
//   el: '#app',
//   // h 就是 createElement 方法
//   render(h) {
//     return h(App)
//   }
// })

// let childComp = {
//   template: '<div>{{msg}}</div>',
//   created() {
//     console.log('child created')
//   },
//   mounted() {
//     console.log('child mounted')
//   },
//   data() {
//     return {
//       msg: 'Hello Vue'
//     }
//   }
// }

// Vue.mixin({
//   created() {
//     console.log('parent created')
//   }
// })

// Vue.component('async-example', function (resolve, reject) {
//   // 这个特殊的 require 语法告诉 webpack
//   // 自动将编译后的代码分割成不同的块，
//   // 这些块将通过 Ajax 请求自动下载。
//   require(['./components/HelloWorld'], function (res) {
//     resolve(res);
//   })
// })

// let app = new Vue({
//   el: '#app',
//   render: h => h(childComp)
// })
