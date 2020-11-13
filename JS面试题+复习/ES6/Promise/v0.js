function test(fn) {
  setTimeout(() => {
    fn('hello world')
  }, 3000);
}

test(function(val) {
  console.log(val)
})
// 3s 之后输出 hello world
// cb -> promise -> Co(generator) -> async
// pending, fulfilled, rejected
new Promise((resolve, reject) => {
  resolve(1)
})
.then((res) => {
  console.log(res)
})