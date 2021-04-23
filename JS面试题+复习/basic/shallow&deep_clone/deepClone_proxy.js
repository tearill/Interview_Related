const MY_IMMER = Symbol('my-immer1')
// 判断参数是否是一个正常 Object 构造出来的对象或数组
const isPlainObject = value => {
  if (
    !value ||
    typeof value !== 'object' ||
    {}.toString.call(value) != '[object Object]'
  ) {
    return false
  }
  var proto = Object.getPrototypeOf(value)
  if (proto === null) {
    return true
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor
  return (
    typeof Ctor == 'function' &&
    Ctor instanceof Ctor &&
    Function.prototype.toString.call(Ctor) ===
      Function.prototype.toString.call(Object)
  )
}
// 判断是否为 proxy 对象
// 首先我们需要判断传入的属性是不是已经为一个 proxy 对象，已经是的话直接返回
const isProxy = value => !!value && !!value[MY_IMMER]

function produce(baseState, fn) {
  // 存放生成的 proxy 对象
  const proxies = new Map()
  const copies = new Map()
  // 拦截 get 的时候首先需要判断 key 是不是 MY_IMMER，是的话说明这时候被访问的对象是个 proxy，要把正确的 target 返回出去
  const objectTraps = {
    get(target, key) {
      if (key === MY_IMMER) return target
      const data = copies.get(target) || target
      return getProxy(data[key])
    },
    set(target, key, val) {
      const copy = getCopy(target)
      const newValue = getProxy(val)
      // 这里的判断用于拿 proxy 的 target
      // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
      copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue
      return true
    }
  }
  // 最后要判断相应的 proxy 是否已经创建过，创建过的话直接从 Map 中拿即可，否则就新创建一个
  const getProxy = data => {
    if (isProxy(data)) {
      return data
    }
    if (isPlainObject(data) || Array.isArray(data)) {
      if (proxies.has(data)) {
        return proxies.get(data)
      }
      const proxy = new Proxy(data, objectTraps)
      proxies.set(data, proxy)
      return proxy
    }
    return data
  }
  // 拦截 set 的时候第一步肯定是生成一个 copy，因为赋值操作都需要在 copy 上进行，否则会影响原数据
  const getCopy = data => {
    if (copies.has(data)) {
      return copies.get(data)
    }
    // 创建 copy，判断数据的类型然后进行浅拷贝操作
    const copy = Array.isArray(data) ? data.slice() : { ...data }
    copies.set(data, copy)
    return copy
  }
  // 最后生成不可变对象
  const isChange = data => {
    if (proxies.has(data) || copies.has(data)) return true
  }

  const finalize = data => {
    if (isPlainObject(data) || Array.isArray(data)) {
      if (!isChange(data)) {
        return data
      }
      const copy = getCopy(data)
      Object.keys(copy).forEach(key => {
        copy[key] = finalize(copy[key])
      })
      return copy
    }
    return data
  }

  const proxy = getProxy(baseState)
  fn(proxy)
  return finalize(baseState)
}

const state = {
  info: {
    name: 'Horace',
    career: {
      first: {
        name: '111'
      }
    }
  },
  data: [1]
}

const data = produce(state, draftState => {
  draftState.info.age = 20
  draftState.info.career.first.name = '222'
})

console.log(data, state)
console.log(data.data === state.data)