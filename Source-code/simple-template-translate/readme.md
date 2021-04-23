# 手写简单的模板编译  

- Vue 模板编译  
  '我是{{name}}, 年龄{{age}}, 性别{{sex}}'  
  ```js
  let data = {
    name: '蔡徐坤',
    age: 18,
    sex: 'male'
  }
  ```
  实现一个 render 方法，
  通过 data 对象中的数据，替换 {{}} 中的内容实现模板编译  
  + 方案：  
  正则匹配 {{?+}} + replace 替换  
  1. 匹配模板字符串的正则：`/\{\{(\w+)\}\}/` 一次就匹配一个  
  2. **reg.exec(...)**  
    reg.exec() 执行正则，返回一个数组，其中存放匹配的结果，如果未找到匹配，则返回值为 null  
    无论 RegExpObject 是否是全局模式，exec() 都会把完整的细节添加到它返回的数组中  
    这就是 exec() 与 String.match() 的不同之处，后者在全局模式下返回的信息要少得多  
    可以这么说，在循环中反复地调用 exec() 方法是唯一一种获得全局模式的完整模式匹配信息的方法  
  3. reg.exec(template)[1] 第二项就是 {{}} 中匹配到的内容  
  4. template.replace(reg, data[key])  

- ES6 模板字符串  
  ```js
  const year = '2017';
  const month = '09';
  const day = '21';

  const str = render('${year}-${month}-${day}')({ year, month, day });
  console.log(str); // 输出2017-09-21
  ```
  实现一个 render 方法，完成相应的输出  
  ```js
  function render(str) {
    return function (args) {
      // console.log(args); // { year: '2017', month: '09', day: '21' }
      Object.keys(args).forEach((item) => {
        str = str.replace(new RegExp('\\${' + item + '}', "g"), args[item]);
      });
      return str;
    }
  }
  ```