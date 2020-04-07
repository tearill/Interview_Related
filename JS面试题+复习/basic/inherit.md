# JS 中的继承  
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
  - 缺点：无法继承父类中的方法，无法继承父类原型上的属性和方法  

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
  - 缺点：  
  1. 构建的 Child2 对象会共享原型链，修改原型上的数据会导致子类中的属性全部跟着改变，实例化对象无法实现隔离  
  2. 在创建 Child 实例的时候，不能向 Parent 传参  
  
3. 组合式继承  
  组合借用构造函数和原型链继承两种方式  
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
