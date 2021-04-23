function Person(name) {
  this.name = name;
  this.getName = function() {
    console.log(this.name);
  };
}

var person1 = new Person('Horace');

// 优化，避免在每创建一个实例的时候方法都要被创建一次
function Person1(name) {
  this.name = name;
  this.getName = getName;
}

function getName() {
  console.log(this.name);
};

var person2 = new Person('David');