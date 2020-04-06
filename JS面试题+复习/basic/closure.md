# 闭包  

## 什么是闭包？  
> 小黄书 P45 定义：一个函数持有对声明它的函数的作用域，使得该作用域能够一直存活，这个引用就叫做闭包  

> 红宝书 P178 定义：闭包是指有权访问另一个函数作用域中的变量的函数。创建闭包的常见方式，就是在一个函数内部创建另一个函数  

> MDN 定义：闭包是指那些能够访问自由变量的函数。(其中自由变量是指函数中使用的，但既不是函数参数 arguments 也不是函数的局部变量的变量，其实就是另一个函数作用域中的变量)  

闭包 = 函数 + 函数能够访问的自由变量  

ECMAScript中，闭包指的是：

1. 从理论角度：所有的函数。因为它们都在创建的时候就将上层上下文的数据保存起来了。哪怕是简单的全局变量也是如此，因为函数中访问全局变量就相当于是在访问自由变量，这个时候使用最外层的作用域。
2. 从实践角度：以下函数才算是闭包：
  + 即使创建它的上下文已经销毁，它仍然存在（比如，内部函数从父函数中返回）
  + 在代码中引用了自由变量

## 闭包产生的原因  
- 作用域链  
  在 ES5 中有两种作用域 --- 全局作用域和函数作用域，当访问一个变量时，解释器会首先在当前作用域查找标识符，如果没有找到，就去父作用域找，直到找到该变量的标识符或者不再父作用域中，这就是作用域链。每一个子函数都会拷贝上级的作用域，形成一个作用域的链条。  
  ```js
  var a = 1;
  function f1() {
    var a = 2;
    function f2() {
      console.log(a); // 3
    }
  }
  ```
  f1 的作用域指向有全局作用域(window)和它本身，而 f2 的作用域指向全局作用域(window)、f1 和它本身。  
  作用域是从最底层开始向上找，直到找到全局作用域 window 位置，如果全局作用域还没有就会报错  

- 闭包产生的本质就是：当前环境中存在指向父级作用域的引用  
  也就是在当前函数的执行上下文中维护了一个作用域链，其中会保存父级的执行上下文中的 AO/VO，即使父级函数执行完毕，执行上下文被销毁之后，但是 JavaScript 依然会让父级执行上下文中的 AO 活在内存中，当前函数依然可以通过它的作用域链找到它，正是因为这样，JavaScript 实现了闭包这个概念  
  ```js
  function f1() {
    var a = 2;
    function f2() {
      console.log(a); // 2
    }
    return f2;
  }
  var x = f1();
  x(); // 2
  ```
  x 会拿到父级作用域中的变量，输出 2，因为在当前环境中，含有对 f2 的引用，f2 引用了 window、f1 和 f2 的作用域。因此 f2 可以访问到 f1 的作用域的变量  
  闭包的本质，只需要让父级作用域的引用存在，因此不一定要返回函数才算闭包，也可以：  
  ```js
  var f3;
  function f1() {
    var a = 2;
    f3 = function() {
      console.log(a);
    }
  }
  f1();
  f3(); // 2
  ```
  让 f1 执行，给 f3 赋值后，现在 f3 拥有了 window、f1 和 f3 本身这几个作用的访问权限，还是自底向上查找，最近是在 f1 中找到了 a，因此输出 2  
  在这里是外面的变量 f3 存在着父级作用域的引用，因此产生了闭包，形式变了但是本质没变  

## 闭包的表现形式  
  1. 返回一个函数  
  2. 作为函数参数传递  
    ```js
    var a = 1;
    function foo() {
      var a = 2;
      function baz() {
        console.log(a);
      }
      bar(baz);
    }
    function bar(fn) {
      // 这就是闭包
      fn();
    }
    // 输出 2，而不是 1
    foo();
    ```
  3. 在定时器、事件监听、Ajax 请求、跨窗口通信、Web Workers 或者任何其他的异步(或者同步)中任务中，只要使用了回调函数，实际上就是在使用闭包  
  4. IIFE 立即执行函数创建闭包，保存了全局作用域 window 和当前作用域，所以可以访问全局的变量  
    ```js
    var a = 2;
    (function IIFE() {
      console.log(a); // 2
    })();
    ```

## 闭包经典问题  
如何解决下面的循环输出问题？  
```js
for (var i = 0; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, 0);
}
```
结果是输出五个 6，要求输出 1, 2, 3, 4, 5  
- 输出五个 6 的原因  
  因为 setTimeout 是宏任务，由于 JS 中单线程 EventLoop 的机制，遇到 setTimeout 产生宏任务，而宏任务在同步任务和微任务执行完成之后才会去执行宏任务，因为循环结束后 setTimeout 中的回调函数才会依次执行，但是输出 i 的时候在当前作用域中没有 i，所以往上一级查找到 i，但是因为循环结束了，i 已经变成了 6，所以依次输出五个 6  

- 解法一：  
  利用 IIFE，在每次循环的时候，把此时的 i 作为变量传递到定时器中  
  ```js
  for (var i = 0; i <= 5; i++) {
    (function (j) {
      setTimeout(function timer() {
        console.log(i);
      }, 0);
    })(i)
  }
  ```

- 解法二：  
  给定时器传入第三个参数，作为 timer 定时器回调函数的参数  
  ```js
  for (var i = 0; i <= 5; i++) {
    setTimeout(function timer(j) {
      console.log(j);
    }, 0, i);
  }
  ```

- 解法三：  
  ES6 的 let  
  ```js
  for (let i = 0; i <= 5; i++) {
    setTimeout(function timer() {
      console.log(i);
    }, 0);
  }
  ```
  let 使得 JS 拥有了块级作用域，用 let 之后作用域链不复存在，代码的作用域以块级为单位  
  例如上面的代码实际执行：  
  ```js
  // i = 1
  {
    setTimeout(function timer() {
      console.log(1);
    }, 0);
  }
  // i = 2
  {
    setTimeout(function timer() {
      console.log(1);
    }, 0);
  }
  // i = 3
  {
    setTimeout(function timer() {
      console.log(1);
    }, 0);
  }
  // i = ......
  ```
  
## 面试必考闭包题  
  ```js
  var data = [];

  for (var i = 0; i < 3; i++) {
    data[i] = function () {
      console.log(i);
    };
  }

  data[0]();
  data[1]();
  data[2]();
  ```
  最后的结果都是 3  
  - 原因分析  
    当执行到 data[0] 函数之前，此时的全局上下文的 VO 为:  
    ```js
    globalContext = {
      VO: {
        data: [...],
        i: 3
      }
    }
    ```
    当执行 data[0] 函数的时候，data[0] 函数的作用域链为:  
    ```js
    data[0]Context = {
      Scope: [AO, globalContext.VO]
    }
    ```
    data[0]Context 的 AO 并没有 i 的值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3  
    以此类推  
  - 改成闭包  
    ```js
    var data = [];

    for (var i = 0; i < 3; i++) {
      data[i] = (function (i) {
        console.log(i);
      })(i);
    }

    data[0]();
    data[1]();
    data[2]();
    ```
    当执行到 data[0] 函数之前，此时的全局上下文的 VO 为:  
    ```js
    globalContext = {
      VO: {
        data: [...],
        i: 3
      }
    }
    ```
    和在使用闭包之前是一样的  
    当执行 data[0] 函数的时候，data[0] 函数的作用域链发生了改变：  
    ```js
    data[0]Context = {
      Scope: [AO, 匿名函数Context.AO globalContext.VO]
    }
    ```
    匿名函数执行上下文的 AO 为：  
    ```js
    匿名函数Context = {
      AO: {
        arguments: {
          0: 0,
          length: 1
        },
        i: 0
      }
    }
    ```
    data[0]Context 的 AO 中并没有 i 这个值，所以会沿着作用域链从匿名函数Context.AO 中查找，这时候就会找到 i 为 0，找到了就不会再往 globalContext.VO 中查找，即使 globalContext.VO 中也有 i 的值，最后打印的结果是 0  
    以此类推  