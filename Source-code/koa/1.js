let o1 = {a: 'hello'}
let o2 = Object.create(o1)

o2.b = 'world'

console.log(o1.b)
console.log(o2.a)
console.log(o2.__proto__);

const Koa = require('koa')
const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'Hello'
})

app.listen(3000)
