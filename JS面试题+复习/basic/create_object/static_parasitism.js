function Person(name) {
  var o = new Object();
  // o.name = name; // 相比寄生构造函数模式没有公共属性，方法也不引用 this
  o.getName = function() {
    console.log(name);
  };
  return o;
}

var person1 = Person('Horace');
person1.getName(); // Horace

person1.name = 'David';
person1.getName(); // Horace
console.log(person1.name); // David