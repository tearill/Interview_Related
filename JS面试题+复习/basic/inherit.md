# JS 中的继承  
## ES5 中的继承  
1. call方式继承 / 借用构造函数继承  
  把父类构造函数的 this 指向为子类实例化对象引用，从而导致父类执行的时候父类里面的属性都会被挂载到子类的实例上去  
  ```js
  function Parent1() {
    this.name = 'parent1';
  }
  function Child1() {
    Parent1.call(this);
    this.type = 'child1'
  }
  ```
  - 优点：解决了原型链继承中子类实例共享父类引用对象的问题，实现多继承，创建子类实例时，可以向父类传递参数  
  - 缺点：  
  1. 无法继承父类中的方法，无法继承父类原型上的属性和方法  
  2. 实例并不是父类的实例，只是子类的实例(instanceof)  

2. 原型链式继承（借用原型链实现继承）  
  ```js
  function Parent2() {
    this.name = 'parent2';
    this.arr = [1, 2, 3];
  }
  function Child2() {
    this.type = 'child2';
  }
  Child2.prototype = new Parent2();
  ```
  - 优点：继承了父类的模板，又继承了父类的原型对象  
  - 缺点：  
  1. 构建的 Child2 对象会共享原型链，修改原型上的数据会导致子类中的属性全部跟着改变，实例化对象无法实现隔离  
  2. 在创建 Child 实例的时候，不能向 Parent 传参  
  
3. 组合式继承  
  组合借用构造函数和原型链继承两种方式  
  + **原型链继承保证子类能继承到父类原型中的属性和方法**  
  + **构造继承保证子类能继承到父类的实例属性和方法**  
  (修正子类构造函数原型对象的 constructor 属性)  
  ```js
  function Parent3() {
    this.name = 'parent3';
    this.arr = [1, 2, 3];
  }
  function Child3() {
    Parent3.call(this);
    this.type = 'child3';
  }
  Child3.prototype = new Parent3();
  ```
  实现了实例化对象的隔离  
  - 缺点：会多执行一次父类的构造函数，父类的构造函数被执行了两次  
          第一次：Child3.prototype = new Parent3();  
          第二次：使用 new 实例化新对象的时候  

4. 组合式继承优化1  
  直接把父类的原型对象赋给子类的原型对象  
  ```js
  function Parent4() {
    this.name = 'parent4';
    this.arr = [1, 2, 3];
  }
  function Child4() {
    Parent4.call(this);
    this.type = 'child4';
  }
  Child4.prototype = Parent4.prototype;
  var s1 = new Child4();
  console.log(s1 instanceof Child4); // true
  console.log(s1.constructor.name); // Parent4
  ```
  - 缺点：
    1. instanceOf 无法区分对象是由 Child4 还是 Parent4 实例化的，s1 的构造函数是父类 Parent4 而不是 Child4  
    2. Child4.prototype = Parent4.prototype; 这句代码只是让 Child4.prototype 直接引用 Parent4.prototype 对象。因此在执行类似`Child4.prototype.key = value;`的赋值语句时会直接修改 Parent4.prototype 对象本身  

5. 组合式继承优化2(继承最完美的方式) --- **寄生组合式继承**  
  ```js
  function Parent5() {
    this.name = 'parent5';
    this.arr = [1, 2, 3];
  }
  function Child5() {
    Parent5.call(this);
    this.type = 'child5';
  }
  Child5.prototype = Object.create(Parent5.prototype);
  Child5.prototype.constructor = Child5;
  console.log(new Child5());
  ```
  - Object.create是一种创建对象的方式，它会创建一个中间对象  
    ```js
    var p = {name: "p"}
    var obj = Object.create(p)
    // Object.create({ name: "p" })
    ```
  - 通过这种方式创建对象，新创建的对象 obj 的原型就是 p，同时 obj 也拥有了属性 name，这个新创建的中间对象的原型对象就是它的参数。

6. 原型式继承  
  ```js
  function createObj(0) {
    function F() {}
    F.prototype = o;
    return new F();
  }
  ```
  是 ES5 中 Object.create() 的模拟实现，将传入的对象作为创建的对象的原型  
  - 缺点：包含引用类型的属性值始终都会共享相应的值，和原型链继承一样  

## ES6 中的继承  
class 关键字，使用 extends 关键字实现继承  
```js
class Point { /* ... */ }

class ColorPoint extends Point {
  super()
  constructor() {
  }
}

let cp = new ColorPoint()
```

## ES5 继承和 ES6 继承的区别  
1. ES5 的继承实质上是**先创建子类的实例对象 this**，然后再将父类的方法添加到 this 上面（Parent.apply(this)）
2. ES6 的继承机制实质上是**先将父类实例对象的方法和属性添加到 this 上面**(所以子类必须先调用 super 方法)，然后再用子类的构造函数修改 this  
3. ES5 的继承不能自定义原生构造函数的子类，比如 Array，因为 ES5 的继承是先创建子类实例对象 this，再将父类类的属性和方法加到子类上，由于父类内部属性无法获取，导致无法继承原生的构造函数  
4. ES6 的继承可以自定义原生构造函数的子类，ES6 继承先创建父类实例的对象 this，然后再用子类的构造函数修改 this，使得父类的所有行为都可以继承  

- class 的 `prototype` 和 `__proto__` 属性  
class 作为构造函数的语法糖，同时具有 prototype 和 `__proto__` 属性  
1. 子类的 `__proto__` 属性表示构造函数的继承，指向父类  
2. 子类 `prototype` 属性的 `__proto__` 表示方法的继承，指向父类的 `prototype`  
```js
class A {}
class B extends A {}

B.__proto__ === A; // true
B.prototype.__proto__ === A.prototype; // true
```
  - 原因  
    产生上面那样结果的原因是，ES6 类的继承实现方式是下面这样的  
    ```js
    class A {}
    class B {}
    // B 的实例继承 A 的实例
    Object.setPrototypeof(B.prototype, A.prototype);
    // B 继承 A 的静态属性
    Object.setPrototypeof(B, A);

    const b = new B();
    ```
  - Object.setPrototypeof 的实现  
    ```js
    Object.setPrototypeOf = function (obj, proto) {
      obj.__proto__ = proto;
      return obj;
    }
    ```
    所以
    ```js
    Object.setPrototypeOf(B.prototype, A.prototype);
    // 等同于
    B.prototype.__proto__ = A.prototype;

    Object.setPrototypeOf(B, A);
    // 等同于
    B.__proto__ = A;
    ```
