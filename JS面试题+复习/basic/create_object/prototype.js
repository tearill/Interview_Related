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

var person1 = new Person();
person1.getName();
console.log(person1.constructor);