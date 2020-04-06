# JS 中的 this  
## 隐式场景  
call/apply/bind 可以显示绑定，主要讨论隐式绑定的场景  
1. 全局上下文  
2. 直接调用函数  
3. 对象.方法的形式调用  
4. DOM 时间绑定(特殊)  
5. new 构造函数绑定  
6. 箭头函数  
- 全局上下文  
  全局上下文默认 this 执行 window，严格模式下指向 undefined  
- 直接调用函数  
  例如：  
  ```js
  let obj = {
    a: function() {
      console.log(this);
    }
  };
  let func = obj.a;
  func(); // window
  ```
  这种方式是直接调用，this 相当于全局上下文的情况  
- 对象.方法的形式调用  
  例如：`obj.a();`  
  this 会指向调用它的那个对象  
- DOM 事件绑定  
  onclick 和 addEventListener 中的 this 默认指向绑定事件的元素  
  IE 比较奇怪，使用 attachEvent，里面的 this 默认执行 window  
- new + 构造函数  
  构造函数中的 this 指向实例对象  
- 箭头函数  
  箭头函数没有 this，也不能绑定 this。箭头函数的 this 会指向当前最近的非箭头函数的 this，找不到就是 window(严格模式下是 undefined)  
  也就是说箭头函数本身不拥有 this 这样一个东西，它的作用域是由作用域查找来决定的，父级的 this  

## 优先级  
默认绑定 < 隐式绑定 < 显式绑定 < new 绑定  

## call/apply/bind 显示绑定  
- 模拟实现一个 call  
  call() 方法在使用一个指定的 this 值和若干个指定的参数值的前提下调用某个函数或方法  
  call(thisArg, arg1, arg2, ...)  
  ```js
  let foo = {
    value: 1
  };

  function bar() {
    console.log(this.value);
  }

  bar.call(foo); // 1
  ```
  注意两点：
  1. call 改变了 this 的指向，指向到 foo  
  2. bar 函数执行了  
  + 模拟实现第一步  
    可以想象在调用 call 的时候，把 foo 对象改造成如下的样子：  
    ```js
    let foo = {
      value: 1,
      bar: function() {
        console.log(this.value);
      }
    };
    foo.bar(); // 1
    ```
    这样 this 就直接指向了 foo，但是这样给 foo 对象本身添加了一个属性，可以使用 delete 删除这个属性  
    所以模拟步骤可以分为：  
    1. 将函数设置成对象的属性  
    2. 执行这个函数  
    3. 删除这个函数  
    **第一版:**  
    ```js
    Function.prototype.myCall = function(context) {
      context.fn = this;// 获取调用 call 的函数
      context.fn(); // 执行这个函数
      delete context.fn; // 从对象中删除这个函数
    }
    ```
  + 模拟实现第二步  
    call 还可以传递参数，传入的参数是不确定的，可以从 Arguments 对象中取值，取第二个到最后一个参数放进一个数组  
    ```js
    let args = [];
    for (let i = 1, len = arguments.length; i < len; i++) {
      args.push('arguments[' + i + ']');
    }
    // 执行后的 args: ["arguments[1], "arguments[2]", ...]
    ```
    把参数数组方法要执行的函数的参数中去：使用 eval，把其中的字符串当作 JS 代码来执行  
    `eval('context.fn(' + args + ')');`  
    **第二版:**  
    ```js
    Function.prototype.myCall = function(context) {
      context.fn = this;// 获取调用 call 的函数
      let args = []; // 参数
      for (let i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']'); // 每一个参数
      }
      // context.fn(); // 执行这个函数
      eval('context.fn(' + args + ')'); // 带上参数执行这个函数
      delete context.fn; // 从对象中删除这个函数
    }
    ```
  + 模拟实现第三步  
    1. this 参数可以传 null，当为 null 的时候，视为指向 window  
    2. 函数可以有返回值  
    **最终版本**  
    ```js
    Function.prototype.myCall = function(context) { // context 是要绑定的 this 
      var context = context || window; // 当传入的 this 参数为 null 的时候指向 window
      context.fn = this;// 获取调用 call 的函数，在那个 conext 对象上去添加方法
      // console.log(this, '--------------');
      let args = []; // 参数
      for (let i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']'); // 每一个参数
      }
      // context.fn(); // 执行这个函数
      // eval('context.fn(' + args + ')'); // 带上参数执行这个函数
      let result;
      if (!args) { // 如果不带参数
        result = context.fn();
      } else { // 带了参数
        result = eval('context.fn(' + args + ')'); // 保存返回值
      }
      delete context.fn; // 从对象中删除这个函数
      return result; // 返回函数运行的结果
    }
    ```
    **ES6 版本**  


- 模拟实现一个 apply  
  apply(thisArg, [...arg])  
  实现方式类似 call  

- 模拟实现一个 bind  
  bind 实现的操作  
  1. 对于普通函数，绑定 this 指向  
  2. 对于构造函数，要保证原函数的原型对象上的属性不能丢失  
  3. 返回一个函数  
  + 返回函数的模拟实现  
  **第一版**
  ```js
  Function.prototype.myBind = function(context) {
    var self = this;
    return function() {
      return self.apply(context);
    }
  }
  ```
  + 传参的模拟实现  
  **第二版**  
  ```js
  Function.prototype.myBind = function(context) {
  var self = this; // 调用 bind 的函数
  // 获取 bind 里面的参数
  var args = Array.prototype.slice.call(arguments, 1);
    return function() { // 返回一个函数
      var bindArgs = Array.prototype.slice.call(arguments); // 获取传给 bind 返回的函数的参数
      return self.apply(context, args.concat(bindArgs)); // 拼接参数并调用函数
    }
  }
  ```
  + 构造函数效果的模拟实现  
  