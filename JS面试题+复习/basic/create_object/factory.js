function createPerson(name) {
  var o = new Object();
  o.name = name;
  o.getName = function() {
    console.log(this.name);
  };
  return o;
}

var person1 = createPerson('Horace');
person1.getName();
console.log(person1.__proto__);

var person2 = createPerson('David');
person2.getName();
console.log(person2.__proto__);