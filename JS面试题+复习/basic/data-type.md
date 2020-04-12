# 数据类型  

## JS 数据类型  
### JS 原始数据类型和引用数据类型
- 原始数据类型    
  1. boolean  
  2. null  
  3. undefined  
  4. number  
  5. string  
  6. symbol  
  7. bigint  
- 引用类型  
  对象 Object(包括普通对象-Object，数组对象-Array，正则对象-RegExp，日期对象-Date，数学函数-Math，函数对象-Function)  
- 一段程序  
  ```js
  function test(person) {
    person.age = 20;
    person = {
      name: "Horace",
      age: 18
    }
    return person;
  } 
  const p1 = {
    name: "Bin",
    age: "19"
  }
  const p2 = test(p1);
  console.log(p1);
  console.log(p2);
  ```
  结果为：`p1: {name: "Bin", age: "20"}   p2: { name: "Horace", age: "18" }`  
  函数传参的时候传递的是对象在堆中的内存地址值，test 函数中的实参 person 是对象 p1 的内存地址  
  调用 person.age = 20 改变了 p1 的值，但是 person 在后面的语句被改变了变成了另一块内存空间的地址，并且在最后将这另一份内存地址空间的地址返回，赋给了 p2  

### null 是对象吗  
  null 不是对象  
  解释：typeof null 会输出 object，但 null 本身不是一个对象，这是 JS 存在的一个历史悠久的 bug。在 JS 的最初版本中使用的是 32 位的系统，为了性能考虑使用低位存储变量的类型信息，000 开头代表的是对象，而 null 表示为全空，所以将它错误地判断成了 object  
  **解决：**可以使用 `Object.prototype.toString.call(null)` -> 输出 `[object Null]`  

  ### '1'.toString() 为什么可以调用？  
  在 `'1'.toString()`这条语句地运行中发生了以下几件事情：  
  ```js
  var s = new Object('1');
  s.toString();
  s = null;
  ```
  **第一步：**创建 Object 类实例 -> 为什么不是 String 而是 Object？-> 由于 Symbol 和 BigInt 地出现，对它们调用 new 都会报错，目前 ES6 规范也不建议用 new 来创建基本类型的包装类  
  **第二步：**调用实例方法 
  **第三步：**执行完方法立即销毁这个实例  

  整个过程体现了基本包装类型的性质，而基本包装类型属于基本数据类型，包括 Boolean，Number 和 String  

### 0.1+0.2 为什么不等于 0.3？  
0.1 和 0.2 在转换成二进制后会无限循环，由于标准位数的限制，后面对于的位数会被截掉，此时就已经出现可精度的损失，相加后因为浮点数小数位的限制而阶段的二进制数字再次转换为十进制就会变成 0.300000000000004...  
参考资料：冴羽大神掘金文章👉https://juejin.im/post/5e6ee1b5f265da5710439f21  

### BigInt  
BigInt：ES6 新的数据类型，当整数值大于 Number 数据类型支持的范围(Number.MAX_SAFE_INTEGER， 最大是 2^53-1)，BigInt 可以使得程序安全地对大整数执行算数操作，表示高分辨率地时间戳，使用大整数 id 等  
- BigInt 的必要性  
  在 JS 中，所有的数字都以双精度 64 位浮点数格式表示，这会导致 JS 中的 Number 无法精确的表示非常大的整数，它会将非常大的整数四舍五入，JS 使用了 IEEE754 标准的双精度浮点数，可以表示的范围是 -(2^53 - 1) ~ 2^53 - 1，超出这个范围的整数值都可能会失去精度  
  例如：  
  `console.log(9999999999999999)` 会输出 10000000000000000  
  `9007199254740992 === 9007199254740993` 会输出 true -> 安全性问题  
- 创建并使用 BigInt  
  1. 在数字的末尾加一个 n  
    `console.log(9007199254740995n)` -> 输出 9007199254740995n  
    `console.log(9007199254740995)` -> 不使用的时候输出 9007199254740996  
  2. 构造函数  
    `BigInt(9007199254740995)` 
- 注意的点  
  1. BigInt 不支持加号运算符，可能是某些程序可能依赖于 + 始终生成 Number 的不变量，或者抛出异常，更改 + 的行为也会破坏 [asm.js](http://www.ruanyifeng.com/blog/2017/09/asmjs_emscripten.html) 代码  
  2. 因为隐式类型转换可能会丢失信息。所以不允许在 BigInt 和 Number 之间进行混合操作。当混合使用大整数和浮点数的时候，结果值可能无法精确表示  
  3. 不能将 BigInt 传给 Web API 和 内置的 JS 函数，这些函数需要一个 Number 类型的数字  
    例如：`Math.max(2n, 4n, 6n)` -> TypeError  
  4. 当 Boolean 和 BigInt 类型相遇的时候，BigInt 的处理方式和 Number 类似，只要不是 0n，BigInt 就会被认为是 true  
  5. 元素都为 BigInt 的数组可以进行 sort  
  6. BigInt 可以正常地进行位运算  

## JS 中的数据类型检测  
### typeof  
**typeof 可以检测到的结果：**`number, string, undefined, boolean, bigint, symbol, object, function`  
  1. 对于原始类型，除了 null 都可以调用 typeof 显示正确的类型  
    ```js
    typeof 1 -> 'number'  
    typeof '1' -> 'string'
    typeof undefined -> 'undefined'
    typeof true -> 'boolean'
    typeof Symbol() -> 'symbol'
    ```
  2. 对于引用数据类型，除了函数之外，都会显示 'object'  
    ```js
    typeof {} -> 'object'
    typeof [] -> 'object'
    typeof console.log -> 'function'
    ```
typeof 的方式对于对象的判断不合适，采用 instanceof 会更好，instanceof 是基于原型链的查询，只要处于原型链中，判断永远为 true  
  ```js
  const Person = function() {}
  const p1 = new Person()
  p1 instanceof Person // true

  var str1 = 'hello world'
  str instanceof String // true
  ```

### instanceof 实现对基本数据类型的检测  
  instanceof 也可以对基本数据类类型进行检测  
  ```js
  class PrimitiveNumber {
    static [Symbol.hasInstance](x) {
      return typeof x === 'number'
    }
  }
  console.log(111 instanceof PrimitiveNumber) // true
  ```
  自定义 instanceof，将原有的 instanceof 重定义，改成 typeof 实现对基本类型的判断  
  Symbol.hasInstance 用于判断某对象是否为某构造器的实例。因此可以用它自定义 instanceof 操作符在某个类上的行为

### 手动实现一个 instanceof  
核心：基于原型链向上查找 - 见 instanceof.js  

### Object.is 和 === 的区别  
Object 在严格等于的基础上修了一些特殊情况下的失误，比如 +0 和 -0  
源码：--- 见 is.js  

## JS 数据类型的转换  
### [] == ![] 
分析：左右两边都要转换成数字判断  
[] 转换为数字 0  
![] 先转换为布尔值，由于 [] 最为一个引用类型转换成布尔值为 true  
因此 ![] 为 false，进而再转换成数字，变为 0  
0 == 0，结果为 0  

### JS 中类型转换有几种？  
JS 中，类型转换只有三种：  
  1. 转换成数字  
  2. 转换成布尔值  
  3. 转换成字符串  

### == 和 === 的区别  
  1. === 是严格相等，左右两边的不仅要值相等，类型也要相等，例如 '1' === 1 -> false  
  2. == 是非严格相等，对于一般情况，只要值相等，就返回 true，但 == 还涉及一些类型转换规则：  
    + 两边的类型是否相等，相同的话就比较值的大小  
    + 判断的是否是 null 和 undefined，是的话就返回 true  
    + 判断的类型是否是 String 和 Number，是的话就把 String 类型转换成 Number，再进行比较  
    + 判断其中一方是否为 Boolean，是的话就把 Boolean 转换成 Number，再进行比较  
    + 其中一方如果是 Object，且另一方为 String、Number 或 Symbol，会将 Object 转换成字符串，再进行比较  
  ```js
  console.log( {a: 1} == true ); // false
  console.log( {a: 1} == "[object Object]" ); // true
  ```
### 对象转原始类型  
对象转原始类型，会调用内置的 [ToPrimitive] 函数，有以下情况：  
  1. 如有 Symbol.toPrimitive()，优先调用再返回  
  2. 调用 valueOf()，如果转换为原始类型，则返回  
  3. 调用 toString()，如果转换为原始类型，则返回  
  4. 如果都没有返回原始类型，会报错  

- 不同类型对象的valueOf()方法的返回值  
  对象          | 返回值
  ------------- | -------------
  Array         | 返回数组对象本身
  Boolean       | 布尔值
  Date          | 存储的时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC
  Function      | 函数本身
  Number	      | 数字值
  Object        |	对象本身。这是默认情况
  String        |	字符串值
  Math 和 Error | Math 和 Error 对象没有 valueOf 方法

- Symbol.toPrimitive() 会干扰一个对象转换为原始值时输出的结果  
  ```js
  // 一个没有提供 Symbol.toPrimitive 属性的对象，参与运算时的输出结果
  var obj1 = {};
  console.log(+obj1);     // NaN
  console.log(`${obj1}`); // "[object Object]"
  console.log(obj1 + ""); // "[object Object]"

  // 接下面声明一个对象，手动赋予了 Symbol.toPrimitive 属性，再来查看输出结果
  var obj2 = {
    [Symbol.toPrimitive](hint) {
      if (hint == "number") {
        return 10;
      }
      if (hint == "string") {
        return "hello";
      }
      return true;
    }
  };
  console.log(+obj2);     // 10      -- hint 参数值是 "number"
  console.log(`${obj2}`); // hello -- hint 参数值是 "string"
  console.log(obj2 + ""); // true  -- hint 参数值是 "default"
  ```
- 通过 valueOf 使 if(a == 1 && a == 2) 成立
举个栗子：  
  ```js
  var a = {
    value: 0,
    valueOf: function() {
      this.value++;
      return this.value;
    }
  };
  console.log(a == 1 && a == 2); // true
  ```
  给一个初始值，在判断的时候会调用对象的 valueOf 方法，每调用一次值会改变一次  