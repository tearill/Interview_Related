import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'
//! Vue 入口代码
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) { //! 保证 Vue 是通过 new 关键字初始化
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options) //! 初始化 Vue
}

initMixin(Vue) //! 合并配置
stateMixin(Vue) //! 初始化 data/props/computed/watcher
eventsMixin(Vue) //! 初始化事件中心
lifecycleMixin(Vue) //! 初始化生命周期
renderMixin(Vue) //! 初始化渲染

export default Vue
