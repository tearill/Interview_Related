# 组件 props 的实现  
## 规范化  
在初始化 props 之前，会先对 props 进行一次规范化 normalize，发生在 _init 中 mergeOptions 的时候  
src/core/util/options.js  
在 mergeOptions 中会调用 normalizeProps(child, vm)  
### normalizeProps  
将编写的 props 转换成对象格式，因为 props 在使用的时候可以写成数组的格式  
- 当 props 是一个数组：
  数组元素 prop 只能是 string 类型，表示 prop 的 key，转成驼峰格式，prop 的类型为空  
  ```js
  name = camelize(val)
  res[name] = { type: null }
  ```
- 当 props 是一个对象：  
  将 props 中每一个 prop 的 key 转换成驼峰格式  
  ```js
  val = props[key]
  name = camelize(key)
  ```
  如果 prop 对应的 value 不是对象类型，就把它规范成对象格式  
  ```js
  res[name] = isPlainObject(val) // 如果 value 不是对象，规范成一个对象
    ? val
    : { type: val }
  ```
- 如果 props 既不是数组也不是对象，就抛出一个警告  
- 举个栗子  
  - 数组格式  
    `props: ['name', 'nick-name']` 会被规范成  
    ```js
    options.props = {
      name: { type: null },
      nickName: { type: null }
    }
    ```
  - 对象格式  
    ```js
    props: {
      name: String,
      nickName: {
        type: Boolean
      }
    }
    ```
    会被规范成  
    ```js
    options.props = {
      name: { type: String },
      nickName: { type: Boolean }
    }
    ```

## 初始化  
当 mergeOptions 执行完毕之后，会去执行 initState 进行一系列的初始化，其中包括了 initProps 也就是 props 的初始化  
`if (opts.props) initProps(vm, opts.props)`  
src/core/instance/state.js  
**initProps 主要做 3 件事情：校验、响应式和代理**  

### 校验  
校验就是遍历 propsOptions 执行以下逻辑  
```js
keys.push(key)
const value = validateProp(key, propsOptions, propsData, vm)
```
propsOptions 是自定义的 props 在规范后生成的 options.props 对象  
propsData 是从父组件传递的 prop 数据  

#### validateProp  
src/core/util/props.js  
validateProp 主要就做 3 件事情：处理 Boolean 类型的数据，处理默认数据，prop 断言，并最终返回 prop 的值  
- boolean 类型数据的处理  
```js
const prop = propOptions[key]
const absent = !hasOwn(propsData, key)
let value = propsData[key]
// boolean casting
const booleanIndex = getTypeIndex(Boolean, prop.type)
if (booleanIndex > -1) {
  if (absent && !hasOwn(prop, 'default')) {
    value = false
  } else if (value === '' || value === hyphenate(key)) {
    // only cast empty string / same name to boolean if
    // boolean has higher priority
    const stringIndex = getTypeIndex(String, prop.type)
    if (stringIndex < 0 || booleanIndex < stringIndex) {
      value = true
    }
  }
}
```
1. 通过 `const booleanIndex = getTypeIndex(Boolean, prop.type)` 来判断 prop 的定义是否是 Boolean 类型  
  也就是去定义的 props 对象中定义的 prop 的类型中查找是否有对应的类型，类型定义可以是单个值也可以是数组  
  如果是单个值就直接使用 isSameType 判断，如果是数组，遍历数组使用 isSameType 判断  
2. 如果 prop.type 是一个 Boolean 类型，则通过 `absent && !hasOwn(prop, 'default')` 来判断如果父组件没有传递这个 prop 数据并且没有设置 default 的情况，则 value 为 false  
3. 如果 Boolean 类型的 prop 传了但是没有给 value 或者是给了 value，就去就去获取 String 类型的下标，如果没有给 String 类型或者是 String 类型被放在 Boolean 类型后面，就会将 value 设置为 true  
  说白了就是这种情况下 Boolean 类型比 String 类型的优先级高  

- 默认数据的处理  
```js
// check default value
if (value === undefined) {
  value = getPropDefaultValue(vm, prop, key)
  // since the default value is a fresh copy,
  // make sure to observe it.
  const prevShouldObserve = shouldObserve
  toggleObserving(true)
  observe(value)
  toggleObserving(prevShouldObserve)
}
```
当 value 的值为 undefined 的时候，说明父组件根本就没有传这个 prop，那么我们就需要通过 getPropDefaultValue(vm, prop, key) 获取这个 prop 的默认值  
  - getPropDefaultValue  
    1. 检测如果 prop 没有定义 default 属性，那么返回 undefined  
    2. 接着是开发环境下对 prop 的默认值是否为对象或者数组类型的判断，如果是的话会报警告，因为对象和数组类型的 prop，他们的默认值必须要返回一个工厂函数  
    3. 接下来的判断是如果上一次组件渲染父组件传递的 prop 的值是 undefined，则直接返回 上一次的默认值 vm._props[key]，这样可以避免触发不必要的 watcher 的更新  
    4. 最后就是判断 def 如果是工厂函数且 prop 的类型不是 Function 的时候，返回工厂函数的返回值，否则直接返回 def  

- prop 断言  
```js
if (
process.env.NODE_ENV !== 'production' &&
// skip validation for weex recycle-list child component props
!(__WEEX__ && isObject(value) && ('@binding' in value))
) {
  assertProp(prop, key, value, vm, absent)
}
```
在开发环境且非 weex 的某种环境下，执行 assertProp 做属性断言  
assertProp 的目的是断言这个 prop 是否合法  
1. 如果 prop 定义了 require 属性但父组件没有传递这个 prop => 报警告  
2. 如果 value 为空且 prop 没有定义 required 属性则直接返回  
3. 接着对 prop 类型做校验  
  尝试将 prop 的 type 转换成类型数组，依次遍历数组执行 assertType(value, type[i]) 获取断言结果  
  直到遍历完成或者 valid 为 true 的时候跳出循环  
  assertType 方法先获取 prop 定义的类型和期望类型，根据几种不同的情况对比 prop 的值 value 是否和 expectedType 匹配，最后返回匹配的结果  
4. 如果循环结束后 valid 还是 false，说明 prop 类型和定义类型都不匹配，就会输出一段警告  
5. 最后判断当 prop 自己定义了 validator 自定义校验器，则执行 validator 校验器方法，如果校验不通过则输出警告信息  

### 响应式  
校验结束，也就是执行完 validateProp 之后，使用 defineReactive 将 prop 变成响应式  

### 代理  
- 响应式处理后把 prop 的值代理到 vm._props 中，可以直接通过 `this.key` 的方式访问 prop  
- 对于非根实例的子组件而言，prop 的代理发生在 Vue.extend 阶段  
  src/core/global-api/extend.js  
  ```js
  // ...
  if (Sub.options.props) {
    initProps(Sub)
  }
  // ...
  function initProps (Comp) {
    const props = Comp.options.props
    for (const key in props) {
      proxy(Comp.prototype, `_props`, key)
    }
  }
  ```
  **这样做的好处是不用为每个组件实例都做一层 proxy，算是一种优化手段**  

## Props 的更新  
父组件传递给子组件的 props 值变化，子组件对应的值也会改变，同时会触发子组件的重新渲染  

### 子组件 props 更新  
- prop 数据的值变化在父组件，当父组件的 render 过程中会访问到这个 prop，所以当 prop 数据变化一定会触发父组件的重新渲染  
- 父组件重新渲染的时候会执行 patch，从而执行 patchVNode => 递归执行，当遇到组件 VNode 的时候会执行组件的 prepatch 钩子  
```js
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
  i(oldVnode, vnode)
}
```
进而执行 prepatch 钩子  
```js
prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
  const options = vnode.componentOptions
  const child = vnode.componentInstance = oldVnode.componentInstance
  updateChildComponent(
    child,
    options.propsData, // updated props
    options.listeners, // updated listeners
    vnode, // new parent vnode
    options.children // new children
  )
},
```
然后走到 updateChildComponent => 更新 props  
> 为什么 vnode.componentOptions.propsData 就是父组件传递给子组件的 prop 数据？  
> 在组件 render 的过程中对于组件节点会使用 createComponent 方法创建组件 vnode  
> 在创建组件 vnode 的过程中，会从 data 中提取出 propData，然后在 new VNode 的时候，作为第七个参数 VNodeComponentOptions 中的一个属性传入，所以可以通过 vnode.componentOptions.propsData 拿到 prop 数据  

- updateChildComponent  
  src/core/instance/lifecycle.js  
  ```js
  // 更新 props 的逻辑
  if (propsData && vm.$options.props) {
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true)
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }
  ```
  propsData：父组件传递的 props 数据  
  vm：子组件实例  
  vm._props：指向子组件的 props 值  
  propKeys：之前 initProps 初始化 props 过程中，缓存的子组件中定义的所有 prop 的 key  
  主要逻辑是遍历 propKeys，然后执行 props[key] = validateProp(key, propOptions, propsData, vm) 重新验证和计算新的 prop 数据，更新 vm._props，也就是子组件的 props  

### 子组件重新渲染  
子组件的重新渲染有 2 种情况，一个是 prop 值被修改，另一个是对象类型的 prop 内部属性的变化  
- props 的值被修改，当执行 `props[key] = validateProp(key, propOptions, propsData, vm)` 更新子组件 prop 值的时候因为响应式原理会触发子组件的重新渲染  
- 对象类型的 prop 内部属性发生变化的时候，这个时候并没有触发子组件 prop 的更新，但是在子组件渲染过程中访问过这个对象 prop，所以这个对象 prop 在触发 getter 的时候会把子组件的 render watcher 收集到依赖中，当在父组件更新这个对象 prop 的时候会触发 setter，进而会去通知子组件 render watcher 触发 update，进而触发子组件的重新渲染  

## toggleObserving  
src/core/observer/index.js  
```js
export let shouldObserve: boolean = true

export function toggleObserving (value: boolean) {
  shouldObserve = value
}
```
使用 shouldObserve 变量，控制在 observe 的过程中是否需要把当前值变成一个 Observer 对象  
- 在 initProps 的过程中，非根实例会执行  
  ```js
  if (!isRoot) {
    toggleObserving(false)
  }
  ```
  表明非根实例不需要进行观测，在走到 defineReative 由于 shouldObserve 变成了 false，走到 observe 的时候就不会去递归 defineReative  
- 为什么要省略？  
  对于对象类型的 prop 值，子组件的 prop 值始终指向父组件的 prop 值，只要父组件的 prop 值变化，就会触发子组件的重新渲染，所以这个 observe 过程是可以省略的  

- 在 validateProp 中对默认值处理的过程中，当父组件没有传递这个 prop  
  ```js
  // check default value 处理默认数据
  if (value === undefined) { // value 为 undefined 说明父组件没有传这个 prop 
    value = getPropDefaultValue(vm, prop, key) // 去找默认值
    // since the default value is a fresh copy,
    // make sure to observe it.
    const prevShouldObserve = shouldObserve
    toggleObserving(true)
    observe(value)
    toggleObserving(prevShouldObserve)
  }
  ```
  因为这个值是一个拷贝，所以需要 toggleObserving(true)，然后执行 observe(value) 把值变成响应式  

- 在 updateChildComponent 过程中  
  和 initProps 一样，对于引用类型 props 不需要做递归响应式操作  
