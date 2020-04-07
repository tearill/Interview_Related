function Person(name) {
  this.name = name;
  if (typeof this.getName != 'function') {
    Person.prototype.getName = function() {
      console.log(this.name);
    }
  }
}

var person1 = new Person('Horace');
person1.getName();