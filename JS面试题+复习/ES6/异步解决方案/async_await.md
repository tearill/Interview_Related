# JS 中的异步实现方式  
1. 回调  
  伪代码  
  ```js
  fs.readFile('./', (content) => {
    setTimeout(() => {
      content += '123';
      fs.append('./', content, (err) => {

      }, 3000);
    });
  })
  ```

2. Promise  
  伪代码  
  ```js
  Promise('./')
    .then((content) => {
      content += '123';
    })
    .then(() => {
      fs.append('./');
    })
    .then()
  ```

3. co + generator  
  伪代码
  ```js
  co {
    function* () {
      let c = yield fs.readFile();
      c += '123';
      let res = yield fs.append('./', c);
    }
  }
  ```
  generator 内部相比普通函数而言，是可以被终止的  
  调用的时候，通过一步步的 next 来调用的  

4. async / await  
  伪代码  
  ```js
  async () => {
    let c = await fs.readFile();
    c += '123';
    let res = await fs.append('./', c);
  }
  ```
  