// Koa 类的提供 iphone 简约之美
let http = require('http')
let EventEmmitter = require('events')
let context = require('./context')
let request = require('./request')
let response = require('./response')

class Koa extends EventEmmitter {
  constructor() {
    super()
    this.fn = undefined
    this.context = context
    this.request = request
    this.response = response
  }
  // 中间件函数
  use(fn) { // 先支持一个函数的 callback
    // 异步
    this.fn = fn
  }

  createContext(req, res) { // 创建 ctx
    // console.log(req, res, '-------')
    const ctx = Object.create(this.context) // 继承原对象
    // Object.create -> ctx 在增加属性的时候不影响原对象
    // ctx.body = 'hello'
    const request = ctx.request = Object.create(this.request)
    const response = ctx.response = Object.create(this.response)
    ctx.req = request.req = response.req = req // 引用式赋值
    ctx.res = request.res = response.res = res
    // request.ctx = response.ctx = ctx
    request.response = response
    response.request = request
    return ctx
  }

  handleRequest(req, res) {
    // 合并成 ctx
    let ctx = this.createContext(req, res)
    this.fn(ctx) // 调用用户给的回调，把 ctx 给用户使用
    res.end(ctx.body) // ctx.body = 'hello' 返回给用户
  }

  // 监听函数
  listen(...args) { // args: port callback
    // this.fn 接收的是 (req, res) => {}
    // 交给中间处理函数，把 (res, res) 加工成 ctx -> 内部调用 this.fn() 
    let server = http.createServer(this.handleRequest.bind(this))
    server.listen(...args)
  }

}

module.exports = Koa
