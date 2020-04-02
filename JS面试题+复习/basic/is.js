// Object.is 源码
function is(x, y) {
  // 运行到 1/x === 1 的时候 x 和 y 都为0，但是 1/+0 = infinity 1/-0 = -infinity 
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // NaN === NaN 是 false，这样是不对的，这里做一个拦截，x !== x，那么一定是 NaN
    return x !== x && y !== y;
  }
} 