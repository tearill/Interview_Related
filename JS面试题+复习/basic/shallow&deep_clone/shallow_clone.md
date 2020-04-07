# JS 中的浅拷贝  
JavaScript的数据类型分为基本数据类型和引用数据类型  

对于基本数据类型的拷贝，并没有深浅拷贝的区别，深浅拷贝都是对于引用数据类型而言的  

## 什么是浅拷贝  
1. 基本数据类型的特点：直接存储在栈(stack)中的数据  
2. 引用数据类型的特点：存储的是该对象在**栈**中引用，真实的数据存放在**堆内存**里  
**浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存**  
**只复制引用，而未复制真正的值**  
- 当把一个对象赋值给一个新的变量时，赋的其实是该对象的在栈中的地址，而不是堆中的数据。也就是两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的  

- 浅拷贝是按位拷贝对象，它会创建一个新对象，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值；如果属性是内存地址（引用类型），拷贝的就是内存地址 ，因此如果其中一个对象改变了这个地址，就会影响到另一个对象。即默认拷贝构造函数只是对对象进行浅拷贝复制(逐个成员依次拷贝)，即只复制对象空间而不复制资源  
```js
let arr = [1, 2, 3];
let newArr = arr;
newArr[0] = 100;
console.log(arr); // [100, 2, 3]
```
直接赋值的情况，不涉及任何拷贝。当改变 newArr 的时候，由于是同一个引用，arr 指向的之也跟着改变  

浅拷贝  
```js
let arr = [1, 2, 3];
let newArr = arr.slice(); // 浅拷贝
newArr[0] = 100;
console.log(arr); // [1, 2, 3]
```
当修改 newArr 的时候，arr 的值并不改变，这是因为 newArr 浅拷贝后的结果，newArr 和 arr 现在引用的不是同一块空间，这就是浅拷贝  
这会带来一个潜在的问题：  
```js
let arr = [1, 2, {val: 3}];
let newArr = arr.slice();
newArr[2].val = 100;
console.log(arr); // [1, 2, {val: 100}]
```
这是浅拷贝的限制所在，它只能拷贝一层对象，如果有对象的嵌套，那么浅拷贝将无能为力。  

## 实现浅拷贝  
### 1. 手动实现  
  ```js
  const shallClone = (target) => {
    if (typeof target === 'object' && target !== null) { // 判断是不是对象
      const cloneTarget = Array.isArray(target) ? [] : {};
      for (let prop in target) {
        if (target.hasOwnProperty(prop)) { // 是不是对象自身的属性
          cloneTarget[prop] = target[prop]; // 如果是对象的话，遍历这个对象，依次赋值
        }
      }
      return cloneTarget;
    } else {
      return target; // 不是对象的话直接返回引用拷贝
    }
  }
  ```

### 2. Object.assign  
  ```js
  let obj = {name: 'Horace', age: 20};
  const obj2 = Object.assign({}, obj, {name: 'David'});
  console.log(obj2); // {name: 'David', age: 20}
  ```
  Object.assign() 拷贝的是对象的属性的引用，而不是对象本身  

## 3. concat 浅拷贝数组  
  ```js
  let arr = [1, 2, 3];
  let newArr = arr.concat();
  newArr[1] = 100;
  consoleo.log(arr); // [1, 2, 3]
  ```

## 4. slice 浅拷贝  
  slice 会对数组的指定部分进行一份浅拷贝  

## 5. ...展开运算符  
  ```js
  let arr = [1, 2, 3];
  let newArr = [..arr]; // 跟 arr.slice() 是一样的效果
  ```
