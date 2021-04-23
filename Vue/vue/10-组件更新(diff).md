# 组件更新  
- 当数据发生变化的时候，会触发渲染 watcher 的回调 updateComponent 函数，进而执行组件的更新过程  
- 组件的更新还是调用了 vm._update 方法  
src/core/instance/lifecycle.js  
```js
const prevVnode = vm._vnode
if (!prevVnode) {
    // initial render
  vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
} else {
  // updates
  vm.$el = vm.__patch__(prevVnode, vnode)
}
```
- 首次渲染 VNode 的时候将 VNode 保存在了 vm._vnode 中，prevVNode 这个时候可以取到值  
- 此时组件更新的过程，会执行 `vm.$el = vm.__patch__(prevVnode, vnode)`，它仍然会调用 patch 函数  
src/core/vdom/patch.js  
```js
if (isUndef(oldVnode)) {
  // empty mount (likely as component), create new root element
  isInitialPatch = true
  createElm(vnode, insertedVnodeQueue)
} else {
  const isRealElement = isDef(oldVnode.nodeType)
  if (!isRealElement && sameVnode(oldVnode, vnode)) {
    // patch existing root node
    patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
  } else {
    if (isRealElement) {
      // mounting to a real element
      // check if this is server-rendered content and if we can perform
      // a successful hydration.
      if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
        oldVnode.removeAttribute(SSR_ATTR)
        hydrating = true
      }
      if (isTrue(hydrating)) {
        if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
          invokeInsertHook(vnode, insertedVnodeQueue, true)
          return oldVnode
        } else if (process.env.NODE_ENV !== 'production') {
          warn(
            'The client-side rendered virtual DOM tree is not matching ' +
            'server-rendered content. This is likely caused by incorrect ' +
            'HTML markup, for example nesting block-level elements inside ' +
            '<p>, or missing <tbody>. Bailing hydration and performing ' +
            'full client-side render.'
          )
        }
      }
      // either not server-rendered, or hydration failed.
      // create an empty node and replace it
      oldVnode = emptyNodeAt(oldVnode)
    }

    // replacing existing element
    const oldElm = oldVnode.elm
    const parentElm = nodeOps.parentNode(oldElm)

    // create new node
    createElm(
      vnode,
      insertedVnodeQueue,
      // extremely rare edge case: do not insert if old element is in a
      // leaving transition. Only happens when combining transition +
      // keep-alive + HOCs. (#4590)
      oldElm._leaveCb ? null : parentElm,
      nodeOps.nextSibling(oldElm)
    )

    // update parent placeholder node element, recursively
    if (isDef(vnode.parent)) {
      let ancestor = vnode.parent
      const patchable = isPatchable(vnode)
      while (ancestor) {
        for (let i = 0; i < cbs.destroy.length; ++i) {
          cbs.destroy[i](ancestor)
        }
        ancestor.elm = vnode.elm
        if (patchable) {
          for (let i = 0; i < cbs.create.length; ++i) {
            cbs.create[i](emptyNode, ancestor)
          }
          // #6513
          // invoke insert hooks that may have been merged by create hooks.
          // e.g. for directives that uses the "inserted" hook.
          const insert = ancestor.data.hook.insert
          if (insert.merged) {
            // start at index 1 to avoid re-invoking component mounted hook
            for (let i = 1; i < insert.fns.length; i++) {
              insert.fns[i]()
            }
          }
        } else {
          registerRef(ancestor)
        }
        ancestor = ancestor.parent
      }
    }

    // destroy old node
    if (isDef(parentElm)) {
      removeVnodes([oldVnode], 0, 0)
    } else if (isDef(oldVnode.tag)) {
      invokeDestroyHook(oldVnode)
    }
  }
}
```
- 此时的 oldVNode 是存在的，并且它和 vnode 都是 VNode 类型，所以接下来会通过 sameVnode(oldVnode, vnode) 判断它们是否是相同的 VNode 来决定走不同的更新逻辑  
```js
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```
- 判断是否是 sameVnode，传递给节点的 key 是关键  
- 如果两个 vnode 的 key 不相等，则是不同的；否则继续判断对于同步组件，则判断 isComment、data、input 类型等是否相同，对于异步组件，则判断 asyncFactory 是否相同  

## 不是相同节点  
分为三步  
1. 创建新的节点：以当前旧节点为参考节点，创建新的节点，并插入到 DOM 中  
2. 更新父占位节点：找到当前 vnode 的父的占位符节点，先执行各个 module 的 destroy 的钩子函数，如果当前占位符是一个可挂载的节点，则执行 module 的 create 钩子函数  
3. 删除旧节点：把 oldVnode 从当前 DOM 树中删除，如果父节点存在，则执行 removeVnodes 方法  

## 是相同节点，要尽可能的做节点的复用  
会调用 src/core/vdom/patch.js 下的 patchVNode 方法  
四个步骤  
- 执行 prepatch 钩子函数  
  prepatch 方法就是拿到新的 vnode 的组件配置以及组件实例，去执行 updateChildComponent 方法  
  src/core/instance/lifecycle.js  
  由于更新了 vnode，那么 vnode 对应的实例 vm 的一系列属性也会发生变化，包括占位符 vm.$vnode 的更新、slot 的更新，listeners 的更新，props 的更新等  

- 执行 update 钩子函数  
  执行完新的 vnode 的 prepatch 钩子函数，会执行所有 module 的 update 钩子函数以及用户自定义 update 钩子函数  

- 完成 patch 过程
  - 如果新 vnode 是文字 vnode，直接调用浏览器的 dom api 把节点的直接替换掉文字内容就好  
  - 如果新 vnode 不是文字 vnode，要对子节点 children 进行对比  
    - 如果有新 children 而没有旧 children，说明是新增 children，调用 addVNodes 添加新的字节点  
    - 如果有旧 children 而没有新 children，说明是删除 children，调用 removeVNodes 删除旧的子节点  
    - 如果新旧 children 都存在，对比新旧子节点，调用 updateChildren  

- 执行 postpatch 钩子函数  

### updateChildren(diff)  
```js
// 旧首节点
let oldStartIdx = 0
// 新首节点
let newStartIdx = 0
// 旧尾节点
let oldEndIdx = oldCh.length - 1
// 新尾节点
let newEndIdx = newCh.length - 1
```
- 根据这些指针，在一个 while 循环中不停的对新旧节点的两端的进行对比，然后把两端的指针向不断内部收缩，直到没有节点可以对比  
- 接下来**进入 diff 的过程**  
  - 每一轮都是同样的对比，**其中某一项命中了，就递归的进入 patchVnode 针对单个 vnode 进行的过程**  
  1. 旧首节点和新首节点用 sameNode 对比  
  2. 旧尾节点和新尾节点用 sameNode 对比  
  3. 旧首节点和新尾节点用 sameNode 对比  
  4. 旧尾节点和新首节点用 sameNode 对比  
  5. 如果以上逻辑都匹配不到，再把所有旧子节点的 key 做一个映射到旧节点下标的 key -> index 表，然后用新 vnode 的 key 去找出在旧节点中可以复用的位置  
  - 不停地把匹配到的指针向内部收缩，直到新旧节点有一端的指针相遇 => 相遇说明这一端的节点全部被 patch 过了  
  - patch 结束后会有两种情况  
  1. 有新节点需要插入：如果更新完之后 `oldStartIdx > oldEndIdx`，说明旧节点先 patch 完了，可能会有新的节点没有被处理到 => 去判断是否有新子节点需要添加  
  2. 有旧节点需要删除：如果更新完之后 `newStartIdx > newEndIdx`，说明新节点先被 patch 完了，说明旧节点还有剩余 => 删除多余的旧子节点  

## 为什么不要以 index 作为 key？  
### 节点 reverse 场景  
```js
[
  {
    tag: "item",
    key: 0,
    props: {
      num: 1
    }
  },
  {
    tag: "item",
    key: 1,
    props: {
      num: 2
    }
  },
  {
    tag: "item",
    key: 2,
    props: {
      num: 3
    }
  }
];
```
触发事件的时候会对数组进行 reverse 操作  
```diff
[
  {
    tag: "item",
    key: 0,
    props: {
+     num: 3
    }
  },
  {
    tag: "item",
    key: 1,
    props: {
+     num: 2
    }
  },
  {
    tag: "item",
    key: 2,
    props: {
+     num: 1
    }
  }
];
```
key 的顺序没有变，但是传入的值变了  
- 按照最合适的逻辑来说，旧的第一个 vnode 是应该直接完全复用 新的第三个 vnode 的，因为它们本来就应该是同一个vnode，自然所有的属性都是相同的  
- 但在进行子节点的 diff 过程中，会将 旧首节点 和 新首节点 用 sameNode 对比，这一步命中逻辑，因为现在新旧两个首部节点的 key 都是 0  
- 然后把 旧的节点 中的第一个 vnode 和 新的节点 中的第一个 vnode 进行 patchVnode 操作  
  在进行 patchVnode 的时候，会去检查 props 有没有变更，如果有的话，会通过 _props.num = 3 这样的逻辑去更新这个响应式的值，触发 dep.notify，触发子组件视图的重新渲染等一套很重的逻辑  

### 节点删除场景  
- Vue 对于组件的 diff 是不关心子组件内部实现的，它只会看你在模板上声明的传递给子组件的一些属性是否有更新，也就是 v-for 中给的 key、tag、是否有 data(不关心内部的值)、是否为注释节点、是否是相同的 input type  
- 举例  
最开始的 vnode 列表为  
```js
[
  {
    tag: "li",
    key: 0,
    // 这里其实子组件对应的是第一个 假设子组件的text是1
  },
  {
    tag: "li",
    key: 1,
    // 这里其实子组件对应的是第二个 假设子组件的text是2
  },
  {
    tag: "li",
    key: 2,
    // 这里其实子组件对应的是第三个 假设子组件的text是3
  }
];
```
在触发事件之后
```js
[
  // 第一个被删了
  {
    tag: "li",
    key: 0,
    // 这里其实上一轮子组件对应的是第二个 假设子组件的text是2
  },
  {
    tag: "li",
    key: 1,
    // 这里其实子组件对应的是第三个 假设子组件的text是3
  },
];
```
- 虽然第一个 vnode 被删除了，但是对于 Vue 来说，它是感知不到子组件里面到底是什么样的实现（它不会深入子组件去对比文本内容）  
- Vue 内部的实现为：  
  1. 原来的第一个节点 text: 1 直接复用  
  2. 原来的第二个节点 text: 2 直接复用  
  3. 发现新节点里少了一个，直接把多出来的第三个节点 text: 3 丢掉  
  这里就发现问题了，本应该删除 text: 1 这个节点并且复用后两个节点，但是使用了 index 作为 key 的情况下会造成删除了 text: 3 这个节点  

## 为什么不要用随机数作为 key？  
如果使用随机数的话，会导致每一次的 key 都是不相同的，在 diff 过程中子节点的首尾对比都无法命中，最后会走到 key 的详细对比，也就是把所有旧子节点的 key 做一个映射到旧节点下标的 key -> index 表，然后用新节点的 key 去匹配，如果没有找到就调用 createElm 方法创建新节点并插入到 DOM 中  
```js
// 建立旧节点的 key -> index 映射表
oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);

// 去映射表里找可以复用的 index
idxInOld = findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
// 一定是找不到的，因为新节点的 key 是随机生成的。
if (isUndef(idxInOld)) {
  // 完全通过 vnode 新建一个真实的子节点
  createElm();
}
```
旧节点会被全部删掉，新节点重新创建  
