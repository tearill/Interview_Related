// let p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject(1)
//   }, 1000);
// })

// let p2 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve(2)    
//   }, 999);
// })

// Promise.all([p1, p2])
//   .then((result) => {
//     console.log(result, 'all');
//   })
//   .catch((error) => {
//     console.log(error, 'all');
//   })

// Promise.race([p1, p2])
//   .then((result) => {
//     console.log(result, 'race result');
//   }).catch((error) => {
//     console.log(error, 'race error');
//   })

setTimeout(() => {
  console.log(1);
}, 1000);

setTimeout(() => {
  console.log(2);   
}, 999);