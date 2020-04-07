function Person(name) {
  var o = new Object();
  o.name = name;
  o.getName = function() {
    console.log(this.name);
  };
  return o;
}

var person1 = new Person('Horace');
person1.getName();
console.log(person1 instanceof Person); // false
console.log(person1 instanceof Object); // true