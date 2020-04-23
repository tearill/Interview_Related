const compileUtil = {
  getValue(expr, vm) {
    // [person, name]
    return expr.split('.').reduce((data, currentVal) => {
      // console.log(currentVal, '++++++++val');
      return data[currentVal.trim()];
    }, vm.$data);
  },
  setVal(expr, vm, val) {
    return expr.split('.').reduce((data, currentVal) => {
      // console.log(currentVal, '++++++++val');
      data[currentVal.trim()] = val;
    }, vm.$data);
  },
  getContentVal(expr, vm) {
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getValue(args[1], vm);
    })
  },
  text(node, expr, vm) { // 节点 expr:msg // <div v-text="person.fav"></div> // {{}}
    let value;
    if (expr.indexOf('{{') !== -1) {
      // 处理 {{}}
      value = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
        // console.log(args, '-------');
        // 绑定订阅者，数据改变触发回调更新视图
        new Watcher(vm, args[1], () => {
          this.updater.textUpdater(node, this.getContentVal(expr, vm));
        })
        return this.getValue(args[1].trim(), vm);
      })
    } else {
      value = this.getValue(expr, vm);
    }

    this.updater.textUpdater(node, value)
  },
  html(node, expr, vm) {
    const value = this.getValue(expr, vm);
    new Watcher(vm, expr, (newVal) => {
      this.updater.htmlUpdater(node, newVal);
    })
    this.updater.htmlUpdater(node, value);
  },
  model(node, expr, vm) {
    const value = this.getValue(expr, vm);
    // 绑定更新函数 数据改变 -> 视图改变
    new Watcher(vm, expr, (newVal) => {
      this.updater.modelUpdater(node, newVal);
    })
    // 视图改变 -> 数据 -> 视图更新
    node.addEventListener('input', (e) => {
      // 设置值
      this.setVal(expr, vm, e.target.value);
    })
    this.updater.modelUpdater(node, value);
  },
  on(node, expr, vm, eventName) {
    let fn = vm.$options.methods && vm.$options.methods[expr];
    node.addEventListener(eventName, fn.bind(vm), false);
  },
  bind(node, expr, vm, attrName) {

  },
  //! 更新的函数
  updater: {
    textUpdater(node, value) {
      node.textContent = value;
    },
    htmlUpdater(node, value) {
      node.innerHTML = value;
    },
    modelUpdater(node, value) {
      node.value = value;
    }
  }
}

//! 实现一个编译器
class Compile {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el); // 判断传进来的 el 是不是元素节点
    // console.log(this.el);
    this.vm = vm;
    // 1. 获取文档碎片对象，放入内存中，会减少页面的回流和重绘
    // 把所有的节点变成文档碎片，如果不用文档随便就会一直回流重绘，使用文档碎片后一次性插入节点，只有一次回流重绘，提高性能
    const fragment = this.nodeToFragment(this.el);
    console.log(fragment);

    // 2. 编译模板
    this.compile(fragment);

    // 3. 追加子元素到根元素
    this.el.appendChild(fragment);
  }
  //! 创建文档碎片
  nodeToFragment(el) {
    // const chileNodes = el.childNodes; // 获取所有的孩子节点
    // el.firstChild
    // 创建文档碎片
    const f = document.createDocumentFragment();
    let firstChild;
    // 每次把 el 的第一项插入到文档碎片中，el 的第一项就没了，下一次循环的第一项就是后一项
    while (firstChild = el.firstChild) {
      f.appendChild(firstChild);
    }
    return f;
  }
  //! 编译模板
  compile(fragment) {
    // 1. 获取每一个子节点(得到节点 -- 类数组)
    const chileNodes = fragment.childNodes;
    // 遍历子节点数组(只遍历到最外层)
    [...chileNodes].forEach(child => {
      // console.log(child);
      if (this.isElementNode(child)) {
        // 如果是元素节点
        // 编译元素节点
        // console.log('元素节点' ,child);
        // 递归遍历
        if (child.childNodes && child.childNodes.length) {
          this.compile(child);
        }
        this.compileElement(child);
      } else {
        // 剩下的其他节点 - 文本节点
        // 编译文本节点
        // console.log('文本节点', child);
        this.compileText(child);
      }
      // 递归遍历
      // if (child.childNodes && child.childNodes.length) {
      //   this.compile(child);
      // }
    })
  }
  //! 编译元素节点
  compileElement(node) {
    console.log(node, '元素node');
    // <div v-text="msg"></div>
    const attrbutes = node.attributes;
    // console.log(attrbutes);
    [...attrbutes].forEach(attr => {
      console.log(attr);
      const { name, value } = attr;
      console.log(name);
      if (this.isDerective(name)) { // 是一个指令 v-text v-html v-model v-on:click v-bind:src
        const [, directive] = name.split('-'); // text html model on:click
        console.log(directive);
        const [dirName, eventName] = directive.split(':'); // text html model on
        // console.log(dirName, eventName);
        // 更新数据 数据驱动视图
        compileUtil[dirName](node, value, this.vm, eventName); // 传递 vm 方便拿到 data

        // 删除有指令的标签上的属性
        node.removeAttribute('v-' + directive);
      } else if (this.isEventName(name)) { // 处理 @click="handleClick"
        let [, eventName] = name.split('@');
        compileUtil['on'](node, value, this.vm, eventName);
      }
    })
  }
  //! 编译文本节点
  compileText(node) {
    // {{}} v-text
    const content = node.textContent;
    // console.log(content, '+++++++content');
    const reg = /\{\{(.+?)\}\}/;
    if (reg.test(content)) {
      console.log(content, '----content');
      compileUtil['text'](node, content, this.vm);
    }
  }
  //! 判断是不是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
  //! 判断是否是指令
  isDerective(attrName) {
    return attrName.startsWith('v-');
  }
  //! 判断是否是简写形式的指令
  isEventName(attrName) {
    return attrName.startsWith('@');
  }
}

class myVue {
  constructor(options) {
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;
    if (this.$el) { // 判断是否指定入口
      // 1. 实现一个数据的观察者
      new Observer(this.$data);
      // 2. 实现一个指令的解析器
      new Compile(this.$el, this); // el 和 当前 Vue 类
      this.proxyData(this.$data); // 代理数据
    }
  }
  proxyData(data) {
    for (const key in data) {
      Object.defineProperty(this, key, {
        get() {
          return data[key]
        },
        set(newVal) {
          data[key] = newVal;
        }
      })
    }
  }
}