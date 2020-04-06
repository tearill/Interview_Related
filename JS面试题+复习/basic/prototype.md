# JS 中的原型链和继承  
## 原型对象和构造函数的关系  
在 JS 中，每定义一个函数数据类型(普通函数、类)的时候，都会天生带一个 prototype 属性，这个属性执行函数的原型对象  
当函数经过 new 调用的时候，这个函数就成为了构造函数，返回一个全新的实例对象，这个实例对象有一个__proto__属性，指向构造函数的原型对象  
- prototype  
  ```js
  function Person() {

  }
  // Person 就是一个构造函数，使用 new 创建了一个新的实例对象 person  
  // var person = new Person();
  // person.name = 'Horace';
  // console.log(person.name); // Horace
  Person.prototype.name = 'Horace';
  var person1 = new Person();
  var person2 = new Person();
  console.log(person1.name); // Horace
  console.log(person2.name); // Horace
  ```
  > **prototype 是函数才有的属性**  
  这个函数的 prototype 指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型，也就是 person1 和 person2 的原型  
  原型：可以理解为每一个 JavaScript 对象(除了 null)在创建的时候就会关联另一个对象，这个对象就是原型，每一个对象都会从原型"继承"属性  
  Person(构造函数) -> Person.prototype(实例原型)  

- \_\_proto\_\_  
  __proto__是每个 JavaScript **对象**(除了 null)都具有的一个属性，这个属性会指向该对象的原型  
  ```js
  function Person() {

  }
  var person = new Person();
  console.log(person.__proto__ === Person.prototype); // true
  ```
  实例化出来的对象的__proto__指向构造它的函数的 prototype  

- constructor  
  原型没有属性指向实例，但是原型有指向构造函数的属性 --- constructor  
  每一个原型都有一个 constructor 属性指向关联的构造函数  
  ```js
  function Person() {

  }
  // Person 就是构造函数 constructor
  console.log(Person === Person.prototype.constructor); // true
  ```
  当获取 person.constructor 的时候，person 自身并没有 constructor 属性，当不能读取到 constructor 属性时，会从 person 的原型也是就是 Person.prototype 中读取，正好原型中有该属性，所以：`person.constructor === Person.prototype.constructor`  

- 总结  
  ```js
  function Person() {

  }
  var person = new Person();
  console.log(person.__proto__ === Person.prototype); // true
  console.log(Person.prototype.constructor === Person); // true
  // getPrototypeOf -> ES5 中获取对象原型的方法
  console.log(Object.getPrototypeOf(person) === Person.prototype); // true
  ```

## 实例与原型  
当读取实例的属性时，如果找不到，就会查找与对象关联的原型中的属性，如果还找不到，就去找原型的原型，直到找到最顶层为止  
举例：  
```js
function Person() {

}
Person.prototype.name = 'Horace';

var person = new Person();
person.name = 'David';
console.log(person.name); // David

delete person.name; // 删除 person 的 name 属性
console.log(person.name); // Horace
```
当删除了 person 的 name 属性，再打印 person.name 的时候在 person 对象自身上找不到 name 属性，就会去 person 的原型也就是 `peron.__proto__` 上，也就是 `Person.prototype` 中查找，找到了 name 属性为 Horace  
如果上面的例子中在对象的原型中没有找到，就会查找原型的原型  

- 原型的原型  
原型也是一个对象，所以可以用最原始的方式创建它  
```js
var obj = new Object();
obj.name = 'Horace';
console.log(obj.name); // Horace
```
其实原型对象就是通过 Object 构造函数生成的  
`Object.prototype.__proto__ === null`  

> **详细图解** --- 见 prototype_instruction.png  

- 原型链  
  JavaScript 对象通过__proto__指向父类对象，直到指到 Object 对象位置，这样就形成了一个原型指向的链条，即原型链  
  也就是 prototype_instruction.png 中红色的线条组成的链状结构  
  + 对象的 hasOwnProperty() 用来检查对象自身是否有某个属性  
  + 使用 in 检查对象中是否有某个属性时，如果对象自身没有但是原型链中有，也会返回 true  

## 趣解原型链  
  每个门派(`FunctionX`)都有一个祖师爷(`prototype`)  
  学徒(`object`)在山上学艺(`= new FunctionX`)，学成下山谨记师门教导，施展一身武艺(`object.xxx() || object.x`)  
  恰逢一日对敌，面对敌人怪异的武功，师门好像未曾教过破解之法(`object 对象没有 yyy 方法`)  
  于是就高喊祖师爷救我，刹那间一道白光降于头顶，祖师爷(`__proto__`)附体  
  一套精绝凌厉的拳法杀的敌人措手不及(`调用原型上的 yyy 方法`)  
  但是敌人也是非常难缠，恐怕要传说中那从天而降的掌法才能制敌，你心里很着急，催祖师爷(`__proto__`)赶紧发招  
  这个时候祖师爷(`__proto__`)说："MD这破掌法当年偷懒没学，我去把我的师祖也叫来问问。。。"(`如果原型中没有 yyy 方法，则继续向上查找原型的原型，这就是所谓的原型链`)  