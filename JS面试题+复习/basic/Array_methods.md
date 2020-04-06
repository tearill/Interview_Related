# JS 中数组相关的点  
## arguments   
所谓类数组对象：拥有一个 length 属性和若干索引属性的对象  
arguments 本身并不能调用数组方法，它是另外一种对象类型，只不过属性从 0 开始排，依次为 0, 1, 2...最后还有 callee 和 length 属性  
常见的类数组还有： 
1. 用 getElementsByTagName/ClassName() 获得的 HTMLCollection  
2. 用 querySelector 获得的 nodeList  
从读写、获取长度、遍历三个方面来看： 
```js
var array = ['name', 'age', 'sex'];

var arrayLike = {
  0: 'name',
  1: 'age',
  2: 'sex',
  length: 3
}
``` 
- 读写  
  ```js
  console.log(array[0]); // name
  console.log(arrayLike[0]); // name

  array[0] = 'new name';
  arrayLike[0] = 'nwew name';
  ```
- 长度   
  ```js
  console.log(array.length); // 3
  console.log(arrayLike.length); // 3
  ```
- 遍历  
  ```js
  for (var i = 0, len = array.length; i < len; i++) { ... }
  for (var i = 0, len = arrayLike.length; i < len; i++) { ... }
  ```
- 调用数组方法  
  + 类数组直接调用数组的方法  
  `arrayLike.push('4');`  
  上述代码会直接报错 `arrayLike.push is not a function`  
  + 类数组间接调用数组的方法  
  ```js
  Array.prototype.join.call(arrayLike, '&'); // name&age&sex
  Array.prototype.slice.call(arrayLike, 0); // ["name", "age", "sex"]
  Array.prototype.map.call(arrayLike, function(item) {
    return item.toUpperCase();
  }); // ["NAME", "AGE", "SEX"]
  ```

## arguments 类数组转数组  
```js
Array.from(arguments);
let arg = [...arguments];
Array.prototype.slice.call(arguments);
Array.prototype.splice.call(arguments);
Array.prototype.concat.call([], arguments);
```

## Arguments 对象  
Arguments 对象只定义在函数体中，包括了函数的参数和其他属性，在函数体中，arguments 指代该函数的 Arguments 对象  
- length 属性  
Arguments 对象的 length 属性表示实参的长度  
- callee 属性  
Arguments 对象的 callee 属性，通过它可以调用函数自身  
**经典闭包题目使用 callee 的解决方法**  
  ```js
  var data = [];
  for (var i = 0; i < 3; i++) {
    (data[i] = function() {
      console.log(arguments.callee.i);
    }).i = i;
  }
  data[0](); // 0
  data[1](); // 1
  data[2](); // 2
  ```
- arguments 对象和对应参数的绑定  
  ```js
  function foo(name, age, sex, hobbit) {
    console.log(name, arguments[0]); // name name

    // 改变形参
    name = 'new name';
    console.log(name, arguments[0]); // new name new nane

    // 改变 arguments
    arguments[1] = 'new age';
    console.log(age, arguments[1]); // new age new age

    // 测试为传入的是否会绑定
    console.log(sex); // undefined

    sex = 'new sex';
    console.log(name, arguments[2]); // new sex undefined

    arguments[3] = 'new habbit';
    console.log(hobbit, arguments[3]); // undefined new hobbit 
  }
  foo('name', 'age');
  ```
  传入的参数，实参会和 arguments 的值会共享，当没有传入时，实参与 arguments 值不会共享  
  如果是在严格模式下，实参和 arguments 是不会共享的  
- 传递参数  
  将参数从一个函数传递到另一个函数  
  ```js
  // 使用 apply 将 foo 的参数传递给 bar
  function foo() {
    bar.apply(this, arguments);
  }
  function bar(a, b, c) {
    console.log(a, b, c);
  }
  foo(1, 2, 3);
  ```

## Arguments 的应用  
1. 参数不定长  
2. 函数柯里化  
3. 递归调用  
4. 函数重载  

## JS 判断数组中是否包含某个值  
1. array.indexOf -- 存在：返回元素下标 | 不存在：返回 -1  
2. array.includes(searchElement[, fromIndex]) -- 存在：返回 true | 不存在： 返回 false  
3. array.find(callback[, thisArg]) -- 存在：返回数组中满足条件的第一个元素的值 | 不存在：返回 undefined  
4. array.findIndex(callback[, thisArg]) -- 存在：返回数组中满足条件的第一个元素的下标 | 不存在：返回 -1  

## JS 数组扁平化  
多维数组 -> 一维数组  
`let arr = [1, [2, [3, [4, 5]]], 6];`  
`let str = JSON.stringify(arr);`  
1. ES6 中的 flat `arr = arr.flat(Infinity)`  
2. replace + split `arr = str.replace(/(\[|\])/g, '').split(',')`  
3. replace + JSON.parse  
  ```js
  str = str.replace(/(\[|\])/g, '');
  str = '[' + str + ']';
  arr = JSON.parse(str);
  ```
4. 普通递归  
  ```js
  let result = []; // 最后存展平的结果
  let fn = function(arr) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i]; // 每一个元素
      if (Array.isArray(item)) { // 如果是数组，继续递归展平
        fn(item);
      } else {
        result.push(item); // 不是数组的时候可以直接放进去
      }
    }
  }
  ```
5. 利用 reduce  
  ```js
  function flatten(arr) {
    return arr.reduce((pre, cur) => {
      return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
    }, []);
  }
  let arr = [1, [2, [3, [4, 5]]], 6];
  console.log(flatten(arr));
  ```
6. 扩展运算符  
  ```js
  // 只要有一个元素是数组，就继续循环展平
  while(arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  ```
