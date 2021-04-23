# JS 创建对象的方式总结  
1. 工厂模式  
  ```js
  function createPerson(name) {
    var o = new Object();
    o.name = name;
    o.getName = function() {
      console.log(this.name);
    };
    return o;
  }
  ```
  缺点：虽然解决了创建多个相似对象的问题，但是没有解决对象识别问题，对象无法识别，因为所有的实例都是指向一个原型  

2. 构造函数模式  
  ```js
  function Person(name) {
    this.name = name;
    this.getName = function() {
      console.log(this.name);
    };
  }
  ```
  优点：实例可以识别为一个特定的类型  
  缺点：每次创建实例时，每个方法都会被创建一次，重复创建  
  **构造函数模式优化**  
  ```js
  function Person1(name) {
    this.name = name;
    this.getName = getName;
  }

  function getName() {
    console.log(this.name);
  };
  ```

3. 原型模式创建  
  ```js
  function Person(name) {

  }

  Person.prototype = {
    name: 'Horace',
    getName: function() {
      console.log(this.name);
    }
  };
  ```
  优点：封装性好了一点  
  缺点：重写了原型，丢失了 constructor 属性  
  **原型模式优化**  
  ```js
  function Person(name) {

  }

  Person.prototype = {
    // 优化 - 加上 constructor 属性
    constructor: Person,
    name: 'Horace',
    getName: function() {
      console.log(this.name);
    }
  };
  ```
4. 组合模式  
  构造函数模式与原型模式结合  
  ```js
  function Person(name) {
    this.name = name;
  }

  Person.prototype = {
    constructor: Person,
    getName: function() {
      console.log(this.name);
    }
  }
  ```
  **动态原型模式**  
  ```js
  function Person(name) {
    this.name = name;
    if (typeof this.getName != 'function') {
      Person.prototype.getName = function() {
        console.log(this.name);
      }
    }
  }
  ```

5. 寄生构造函数模式  
  ```js
  function Person(name) {
    var o = new Object();
    o.name = name;
    o.getName = function() {
      console.log(this.name);
    };
    return o;
  }
  ```
  打着构造函数的幌子挂羊头卖狗肉！  
  创建的函数使用 instanceof 无法指向其构造函数  
  **稳妥构造函数模式**  
  ```js
  function Person(name) {
    var o = new Object();
    // o.name = name; // 相比寄生构造函数模式没有公共属性，方法也不引用 this
    o.getName = function() {
      console.log(name);
    };
    return o;
  }
  ```
  稳妥对象没有公共属性，并且其方法也不引用 this  
  与寄生构造函数不同的是：  
  1. 新创建的实例方法不引用 this  
  2. 不使用 new 操作符调用构造函数  
  稳妥对象适合在一些安全的环境中  
  缺点：无法识别对象  