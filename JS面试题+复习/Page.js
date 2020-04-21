function Page() {
  // console.log(this);
  return this.hosts;
}

Page.hosts = ['h11111'];
Page.prototype.hosts = ['h22222'];

var p1 = new Page();
var p2 = Page();

console.log(p1); // ['h22222']
console.log(p2); // undefined
