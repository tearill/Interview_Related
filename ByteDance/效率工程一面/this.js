function foo() {
  console.log(this.a);
}
let obj = {
  foo() {}
};
// 1
foo();
// 2
obj.foo();
// 3
foo.call();
foo.apply();
foo.bind();
function Bar() {
  // this 
  this.a = 123;
}
let obj1 = {};
// 1:bind
const Bar2 = Bar.bind(obj1);
// new 的时候 this 指向 bar
// 2:new
const bar = new Bar2();

console.log(obj1, bar); // {} Bar { a: 123 }