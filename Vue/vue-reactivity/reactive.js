// reactive(obj);
// reactive(obj1);
// {
//  obj: {
//    name: [() => {}, () => {}]  Set
//    sex: [() => {}, () => {}]
//    age: [() => {}, () => {}]
//  },
//  obj1: {}
// }
let effectStack = [];
// 1: () => lis[0].innerHTML = `${observerData.name}`; 由一个函数 触发 get
// 
function effect(func) {
  if (effectStack.indexOf(func) === -1) {
    effectStack.push(func);
    func();
    // func -> get 取最后一项添加依赖
    // 加完之后 pop
    effectStack.pop();
  }

}
let targetMap = new Map();
function reactive(obj) {
  let observerObj = new Proxy(obj, {
    get(target, key, receiver) {
      // 依赖收集：依赖当前这个 key 的地方，我们统一起来
      // key name
      // 对象下面什么依赖
      let dep = targetMap.get(target);
      if (dep === undefined) {
        dep = new Map();
        targetMap.set(target, dep);
      }
      // 属性下面 有什么依赖
      let depsMap = dep.get(key);
      if (depsMap === undefined) {
        depsMap = new Set();
        dep.set(key, depsMap);
      }
      // 添加一个依赖 添加 => 触发 get 那个函数
      let lastfn = effectStack[effectStack.length - 1];
      depsMap.add(lastfn);
      let res = Reflect.get(target, key, receiver)
      return res;
    },
    set(target, key, value, receiver) {
      // 把依赖 key 的地方，重新执行一次
      let res = Reflect.set(target, key, value, receiver)
      let deps = targetMap.get(target).get(key);
      for (let fn of deps) {
        fn && fn();
      }
      return res;
    },
  })
  return observerObj;
}