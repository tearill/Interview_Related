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
console.log(myInstanceof('111', String)); // false
console.log(myInstanceof(new String('111'), String)); // true
console.log(myInstanceof('string', Object)); // false
console.log(myInstanceof(() => {}, Function), 'function'); // 无法判断！！！！缺陷

// instanceof 主要的实现原理就是只要右边变量的 prototype 在左边变量的原型链上
// instanceof 在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype，如果查找失败，则会返回 false
function new_instance_of(leftVaule, rightVaule) {
  let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
  leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值
  while (true) {
    if (leftVaule === null) { // 遍历完原型链还是没找到
        return false;	
      }
    if (leftVaule === rightProto) { // 在左边变量的原型链上找到了
      return true;	
    } 
    leftVaule = leftVaule.__proto__; // 继续向上查找原型链
  }
}
console.log(new_instance_of(() => {}, Function)); // true

class PrimitiveNumber {
  static [Symbol.hasInstance](x) {
    return typeof x === 'number'
  }
}
console.log(111 instanceof PrimitiveNumber) // true