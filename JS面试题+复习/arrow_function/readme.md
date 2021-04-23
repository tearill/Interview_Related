# 箭头函数很简便，功能也被简化了  
简约，arrow function 缺了很多东西  

1. 内部没有 this，通过作用域查找，父级的 this  

- super 关键字，举出应用场景  
  super 是继承关系里的  
  ```js
  class Persion {
    constructor() {
      super()
      this.
    }
  }
  ```
  super 属于函数的  
  class super 用法  

- 别的可能性让 JS 函数有 super 的使用？  
  对象间继承关系的新方法 Object.setPrototypeOf(childObject, fatherObject)  

- 函数 this arguments super(指向父类)  

2. `'super' keyword unexpected here` 箭头函数没有 super 关键字  

3. `new.target expression is not allowed here` 箭头函数不适合用来做构造函数，它没有 new.target  

JS 一切皆对象，对象 函数 区分一下  
对象有__proto__属性，原型对象  
函数 prototype  
生成对象时，对象的__proto__属性指向函数的 prototype 属性  

4. 箭头函数是不可以被 new 的，它没有 this  

5. 箭头函数没有 arguments 属性  
