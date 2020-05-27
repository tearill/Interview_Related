// 请求对象
let url = require('url')

let request = {
  get url() { // 不用原生的 req 对象，用 ctx.request.url
    // console.log(this, '+++++')
    return this.req.url // this -> ctx
  },
  get path() {
    return url.parse(this.req.url).pathname
  },
  get query() {
    return url.parse(this.req.url).query
  }
}

module.exports = request
