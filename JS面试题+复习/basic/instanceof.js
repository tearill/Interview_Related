// 语法：object instanceof constructor
// MDN -> https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof
function myInstanceof (left, right) {
  // 基本数据类型直接返回 false 
  if (typeof left !== 'object' || left === null) return false;
  // getPrototypeOf 拿到对象的原型
  let proto = Object.getPrototypeOf(left);
  while(true) {
    if(proto == null) return false; // 找到了原型链最顶端还没找到
    if(proto == right.prototype) return true; // 找到了相同的原型对象
    proto = Object.getPrototypeOf(proto); // 继续向上查找原型链
  }
}

console.log(myInstanceof('111', String));
console.log(myInstanceof(new String('111'), String));