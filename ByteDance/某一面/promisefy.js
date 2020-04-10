const fs = require('fs');
const util = require('util');

fs.readFile('./for-map.js', {encoding: 'utf8'}, (err, file) => {
  console.log(file);
});
// 最后是一个回调
// const fsReadFile = util.promisify(fs.readFile); // 变成 promise
// fsReadFile('./for-map.js', {encoding: 'utf8'})
// .then(info => {
//   console.log(info, 'promisefy+++');
// })

// 1. 接受一个函数(具有常见的错误优先的回调风格的函数)
// 2. promisefy 返回一个函数
// 3. 参数，调用的时候来的
// function promisefy(func) {
//   return (...args) => {
//     return new Promise((resolve, reject) => {
//       func(...args, (err, res) => {});
//     })
//   }
// }

// 写一个 promisefy
function myPromisefy(func) {
  // 返回？
  return (...args) => {
    return new Promise((resolve, reject) => {
      // 什么时候文件读取完就 resolve
      func(...args, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      })
    })
  }
}

const fsReadFile = myPromisefy(fs.readFile);
fsReadFile('./for-map.js', {encoding: 'utf8'})
.then(info => {
  console.log(info, 'promisefy+++');
})