# JS 中的深拷贝  
## 什么是深拷贝  
深拷贝就是对目标的完全拷贝，不像浅拷贝那样只是复制了一层引用，就连值也都复制了  

只要进行了深拷贝，它们老死不相往来，谁也不会影响谁  

## 深拷贝实现方案  
深拷贝一般分两种  
1. 利用 JSON 对象中的 parse 和 stringify  
2. 利用递归来实现每一层都重新创建对象并赋值  

- JSON.stringify/parse 方式  
  ```js
  let arr = [1, 2, 3];
  let newArr = JSON.parse(JSON.stringify(arr));
  console.log(arr === newArr); // false
  ```
  **存在的问题：**只能适用于简单的情况  
  1. 无法解决循环引用的问题  
    例如：  
    ```js
    const a = {val: 2};
    a.target = a;
    ```
    拷贝 a 会出现系统栈溢出，因为出现无限递归的情况  
  2. 无法拷贝一些特殊的对象，例如 RegExp、Date、Set、Map  
  3. 无法拷贝函数  
    例如：  
    ```js
    const obj = {
      name: 'Horace',
      getName: function() {
        console.log(this.name);
      }
    };
    console.log(obj); // {name: "Horace", getName: ƒ}
    const cloneObj = JSON.parse(JSON.stringify(obj));
    console.log(cloneObj); // {name: "Horace"}
    ```

- 递归实现深拷贝  
  一般是工具库中的深拷贝函数实现方式，比如 loadash 中的 cloneDeep，虽然这种做法能解决第一种做法的局限，但是对于庞大的数据来说性能并不好，因为需要把整个对象都遍历一遍  
  在拷贝的时候判断一下属性值的类型，如果是对象，递归调用深拷贝函数  
  ```js
  const deepClone = (obj)  => {
    const cloneObj = Array.isArray(obj) ? [] : {}; // 判断赋值的目标是数组还是对象
    for (let key in source) {
      if (obj.hasOwnProperty(key)) {
        // 如果值是对象，就递归深拷贝，如果不是，就直接赋值
        cloneObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
      }
    }
  }
  ```

- 高效率的深拷贝  
  考虑是否可以实现只有当属性修改以后才对这部分数据做深拷贝，又能解决 JSON.parse(JSON.stringify(a)) 的局限  
  重点是要知道用户修改了什么属性  
  使用 Proxy，通过拦截 set 和 get 就能达到目的  
  核心思路:  
  1. 拦截 set，所有的赋值都在 copy(原数据浅拷贝的对象) 中进行，这样就不会影响到拦截对象  
  2. 拦截 get，通过属性是否修改的逻辑分别从 copy 或者原数组中取值  
  3. 最后生成不可变对象的时候遍历对象，判断属性是否被修改过，也就是判断是否存在 copy。  
     如果没有修改过，就返回原属性，并且也不需要再对子属性对象遍历，提高了性能。  
     如果修改过，就需要把 copy 赋值到新对象上，并且递归遍历  
  