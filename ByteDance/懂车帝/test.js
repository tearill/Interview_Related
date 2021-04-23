// let i = 1
// for (let i = 0; i <= 10; i++) {
//   setTimeout(() => {
//     console.log(i)
//   }, 0);
// }
// 1 2 3 4 5 6 7 8 9 10

// let i = 1
// for (var i = 0; i <= 10; i++) {
//   setTimeout(() => {
//     console.log(i)
//   }, 0);
// }
// Uncaught SyntaxError: Identifier 'i' has already been declared

// var i = 1
// for (let i = 0; i <= 10; i++) {
//   setTimeout(() => {
//     console.log(i)
//   }, 0);
// }
// Uncaught SyntaxError: Identifier 'i' has already been declared


let p1 = Promise.resolve(1);
let p2 = Promise.reject(2);

// all 成功的时候按顺序输出
// all 失败的时候返回最先 reject 的值
// Promise.all([p1, p2])
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

// race 数组里哪个结果获取的快就返回哪个结果，不管结果本身是成功还是失败
Promise.race([p1, p2])
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
