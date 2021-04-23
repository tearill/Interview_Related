# for...in 和 for...of 的区别  

for in            for of
1 适合遍历对象     适合遍历拥有迭代器对象的集合，不包括对象

2 遍历的是 key      遍历的 value

3 遍历可枚举的所有属性（包括原型上的）     不包括原型上的

4 可以正确响应 break continue      也可以正确响应 break continue

5 遍历的顺序不确定    

- for...of 循环内部调用的是数据结构的 Symbol.iterator 方法，一个数据结构只要拥有 Symbol.iterator 属性，就被视为有 iterator 结构，就可以使用 for...of 的方式遍历它的属性  

- for...of 循环可以使用的范围包括包括数组、Set 和 Map 结构、某些类似数组的对象（比如 arguments 对象、DOM NodeList 对象）、Generator 对象，以及字符串  

- 遍历数组的时候  
  for ... of 循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性  
  举例：
  ```js
  let arr = [1, 2, 3];
  arr.foo = 'hello';
  for (let i in arr) {
    console.log(i); // '0', '1', '2', 'foo'
  }

  for (let i of arr) {
    console.log(i); // 3 5 7
  }
  ```
