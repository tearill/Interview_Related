const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function MyPromise(fn) {
  const _this = this;
  _this.value = null; // 传递给 resolve 或者 reject 的参数
  _this.state = PENDING; // Promise 初始状态为 pending
  _this.resolvedCallbacks = []; // then 中的 resolve 回调
  _this.rejectedCallbacks = []; // then 中的 reject 回调

  function resolve(value) {
    if (_this.state === PENDING) {
      _this.state = FULFILLED; // 改变状态
      _this.value = value; // resolve 参数
      _this.resolvedCallbacks.map(cb => cb(_this.value)); // 把所有 resolve 回调执行一遍
    }
  }

  function reject(value) {
    if (_this.state === PENDING) {
      _this.state = REJECTED;
      _this.value = value;
      _this.rejectedCallbacks.map(cb => cb(_this.value));
    }
  }

  fn(resolve, reject);
}

MyPromise.prototype.then = function (onFufilled, onRejected) {
  const _this = this;
  onFufilled = typeof onFufilled === 'function' ? onFufilled : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };

  if (_this.state === PENDING) { // 注册 resolve 和 reject 回调
    _this.resolvedCallbacks.push(onFufilled);
    _this.rejectedCallbacks.push(onRejected);
  }

  _this.state === FULFILLED && onFufilled(_this.value);

  _this.state === REJECTED && onRejected(_this.value);
}

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 0)
}).then(value => {
  console.log(value)
})
