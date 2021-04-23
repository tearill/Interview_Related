# Vue 的生命周期  
## beforeCreate - Vue.prototype._init()
在 initState() 之前执行  
实例初始化 new Vue()  
所有的 props、data、methods、watch、computed 等属性都还未初始化，所有的数据和属性挂载在 $options 上  

new Vue => beforeCreate() => observer Data => init Event => created()

## created - Vue.prototype._init()  
在 initState() 之后执行  
props、data、methods、watch、computed 等属性已经初始化(过程中调用 definedReactive 将数据变成响应式)  

> 在这俩个钩子函数执行的时候，并没有渲染 DOM，所以也不能够访问 DOM，一般来说，如果组件在加载的时候需要和后端有交互，放在这俩个钩子函数执行都可以，如果是需要访问 props、data 等数据的话，就需要使用 created 钩子函数  

## beforeMount  
DOM 挂载之前，调用时机是在 mountComponent 函数中，判断完 render 函数是否存在之后  
vm._update(vm._render(), hydrating)  
开始创建 VDOM，执行 vm._render() 函数生成 VNode 之前，执行了 beforeMount 钩子函数  

## mounted  
执行完 vm._update() 把 VNode patch 成为真实 DOM 后，执行 mounted 钩子  
组件中如果有子组件的话，会递归挂载子组件，只有当所有子组件全部挂载完毕，才会执行根组件的挂载钩子  
vm.$el = el  
创建 Vue 实例的 $el，然后用它替代 el 属性  

## beforeUpdate  
beforeUpdate 的执行时机是在渲染 Watcher 的 before 函数中
状态更新之前执行，发生在虚拟 DOM 重新渲染和 patch 之前，此时 data 中的状态值是最新的，但是页面上数据还是旧的，因为还没有重新开始 patch  

## updated  
update 的执行时机是在 flushSchedulerQueue 函数调用的时候  
状态更新完成后调用，此时 data 中的状态值和界面上显示的数据都完成了更新，界面已经被重新渲染好了  

## beforeDestroy  
beforeDestroy 钩子函数的执行时机是在 $destroy 函数执行最开始的地方  
实例销毁之前调用，此时实例仍然完全可用  

## destroyed  
接着执行了一系列的销毁动作，包括从 parent 的 $children 中删掉自身，删除 watcher，当前渲染的 VNode 执行销毁钩子函数等，执行完毕后再调用 destroyed 钩子函数  
所有的事件监听器都会被移除，所有的子实例也会被销毁  

> 在 $destroy 的执行过程中，它又会执行 `vm.__patch__(vm._vnode, null)` 触发它子组件的销毁钩子函数，这样一层层的递归调用，所以 destroy 钩子函数执行顺序是先子后父，和 mounted 过程一样  

## keep-alive 组件  
`<keep-alive>` 在 created 钩子里定义了 this.cache 和 this.keys，本质上它就是去缓存已经创建过的 vnode  
`<keep-alive>` 直接实现了 render 函数  
使用 matches 函数判断当前组件的名称和 include、exclude 的关系  
如果没有命中缓存(include 不匹配或被 exclude 匹配)，返回组件的 VNode  
如果命中缓存的配置  
  1. 如果是之前缓存过的，直接从缓存中拿 VNode 实例，并且重新调整了 key 的顺序放在了最后一个  
  2. 如果没有缓存过，将组件的 VNode 设置进缓存 cache 中，如果配置了 max 并且缓存长度超过 max，还要从缓存中删除第一个(要判断删除的缓存组件 tag 不是当前渲染组件 tag) => 执行 $destory 删除  

设置 vnode.data.keepAlive = true => 方便组件加载的时候进行判断  
```js
if (vnode.data.keepAlive)
  if (context._isMounted)
```

## activated  
执行时机是 `<keep-alive>` 包裹的组件渲染的时候  
判断被 `<keep-alive>` 包裹的组件是否已经 mounted  
1. 已经 mounted => 执行 queueActivatedComponent(componentInstance) => 执行组件的 acitvated 钩子函数，并且递归去执行它的所有子组件的 activated 钩子函数  
2. 还未 mounted => 执行 activateChildComponent(componentInstance, true)  

## deactivated  
发生在 VNode 的 destory 钩子函数  
deactivateChildComponent(componentInstance, true)  
执行组件的 deacitvated 钩子函数，并且递归去执行它的所有子组件的 deactivated 钩子函数  

## 使用时机  
异步请求放在 created 里面(属性都已经初始化)，可以访问 this  
DOM 操作最早放在 mounted 里面，mounted 执行的时候 VNode 已经 patch 成为真实 DOM  
