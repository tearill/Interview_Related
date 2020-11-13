# null 和 undefined 的区别  
- null：代表 “空值”，代表一个空对象指针，使用 typeof 运算得到 “object” ，所以可以认为它是一个特殊的对象值  
- undefined：当一个声明了一个变量未初始化时，得到的就是 undefined  
- javascript 权威指南：null 和 undefined 都表示 “值的空缺”，你可以认为 undefined 是表示系统级的、出乎意料的或类似错误的值的空缺，而 null 是表示程序级的、正常的或在意料之中的值的空缺  
- javascript 高级程序设计：在使用 var 声明变量但未对其加以初始化时，这个变量的值就是 undefined。null 值则是表示空对象指针  

- typeof 的判断  
  - typeof null => object  
  - typeof undefined => undefined  

- null 在计算的时候可以自动转换成 0  

- 用法  
  - null 表示 “没有对象”，即该处不应该有值。
    1. 作为函数的参数，表示该函数的参数不是对象  
    2. 作为对象原型链的终点  

  - undefined 表示“缺少值”，就是此处应该有一个值，但是还没有定义  
    1. 变量被声明了，但没有赋值时，就等于 undefined  
    2. 调用函数时，应该提供的参数没有提供，该参数就等于 undefined  
    3. 对象没有赋值的属性，该属性的值为 undefined  
    4. 函数没有返回值时，默认返回 undefined  

- 转化的时候，undefined 为 NaN，null 为 0  
  ```js
    Number(undefined)　　// NaN

    Number(undefined + 10)　　// NaN

    Number(null)　　// 0

    Number(10 + null)　　// 10

    undefined === null　　// false

    undefined == null　　// true
  ```
