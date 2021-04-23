const shallClone = (target) => {
  if (typeof target === 'object' && target !== null) { // 判断是不是对象
    const cloneTarget = Array.isArray(target) ? [] : {};
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) { // 是不是对象自身的属性
        cloneTarget[prop] = target[prop]; // 如果是对象的话，遍历这个对象，依次赋值
      }
    }
    return cloneTarget;
  } else {
    return target; // 不是对象的话直接返回引用拷贝
  }
}
