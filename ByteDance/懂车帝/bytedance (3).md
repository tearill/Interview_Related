# 懂车帝前端实习生一二面

## 一面

**怎么学习**

看视频，看官方文档，写项目，小demo，看书，逛社区看文章，写文章。

**最近印象最深的文章**

我说一篇介绍ES6到ES10新特性的文章(对这一块比较熟悉，就有了下面的追问)

**ES6的新特性**

**箭头函数**

**let&const**

**以下题目分别输出什么，为什么**

```javascript
let i = 1
for (let i = 0; i <= 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 0);
}
// 1 2 3 4 5 6 7 8 9 10

let i = 1
for (var i = 0; i <= 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 0);
}
// Uncaught SyntaxError: Identifier 'i' has already been declared

var i = 1
for (let i = 0; i <= 10; i++) {
  setTimeout(() => {
    console.log(i)
  }, 0);
}
// Uncaught SyntaxError: Identifier 'i' has already been declared
```

**ES6异步解决方案**

**promise和async，await的区别**

**promise有哪些方法**

**下面代码输出什么**

```javascript
let p1 = Promise.resolve(1);
let p2 = Promise.reject(2);

// all 成功的时候按顺序输出
// all 失败的时候返回最先 reject 的值
Promise.all([p1, p2])
  .then((res) => console.log(res))
  .catch((err) => console.log(err)); // 2
// race 数组里哪个结果获取的快就返回哪个结果，不管结果本身是成功还是失败
Promise.race([p1, p2])
  .then((res) => console.log(res))
  .catch((err) => console.log(err)); // 1
```



**写一个promise限流函数**

```javascript
function limitedPromise(tasks, limit) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let alive = 0;
    let finish = 0;
    let result = [];

    function trigger() {
      if (finish >= tasks.length) {
        resolve(result);
        return;
      }

      while (alive < limit && index < tasks.length) {
        alive++;
        const promise = tasks[index]();
        let curIndex = index;
        promise
          .then((value) => {
            alive--;
            finish++;
            result[curIndex] = value;
            trigger();
          })
          .catch(err => {
            reject(err);
          })
        index++;
      }
    }

    trigger();
  })
}

function createTask(ms) {
  return () => {
    console.log('add one task', ms);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('finish one task');
        resolve(ms);
      }, ms)
    });
  }
}

const tasks = Array(5).fill(null).map((_, index) => createTask(index * 1000));
limitedPromise(tasks, 2).then(console.log);
```



**前端路由原理**

hash模式和history模式原理

**Vue的生命周期**

**详细讲下每个钩子函数干了什么**

**keep-live原理**

**原理：**在create钩子函数调用时将需要缓存的VNode节点保存在cache中，在 render（页面渲染） 时，如果 VNode 的 name 符合缓存条件（可以用 include 以及 exclude 控制），则会从 this.cache 中取出之前缓存的 VNode 实例进行渲染。

**使用**

1. 缓存所有页面

   ```vue
   <template>
     <div id="app">
     	<keep-alive>
         <router-view/>
       </keep-alive>
     </div>
   </template>
   ```

2. 根据条件缓存页面

   ```vue
   <template>
     <div id="app">
     	// 1. 将缓存 name 为 test 的组件
     	<keep-alive include='test'>
         <router-view/>
       </keep-alive>
   	
   	// 2. 将缓存 name 为 a 或者 b 的组件，结合动态组件使用
   	<keep-alive include='a,b'>
     	  <router-view/>
   	</keep-alive>
   	
   	// 3. 使用正则表达式，需使用 v-bind
   	<keep-alive :include='/a|b/'>
     	  <router-view/>
   	</keep-alive>	
   	
   	// 5.动态判断
   	<keep-alive :include='includedComponents'>
     	  <router-view/>
   	</keep-alive>
   	
   	// 5. 将不缓存 name 为 test 的组件
   	<keep-alive exclude='test'>
     	  <router-view/>
   	</keep-alive>
     </div>
   </template>
   ```

3. 结合Vue-Router的路由元信息，缓存组件

   - router目录的index.js

     ```javascript
     meta: {
         keepAlive: true
     }
     ```

   - App.vue文件

     ```vuevue
     <keep-alive>
       <router-view v-if="$route.meta.keepAlive"></router-view>
     </keep-alive>
     ```

     

**Vue操作DOM**

$refs

**模板编译在哪个生命周期**

mount阶段执行了compile方法将template里面的内容转化成真正的HTML代码

## 二面

**最喜欢大学的哪门课**

**千分位函数**

```javascript
function format(nums) {
  nums = nums + "";
  let temp = [],
    flag = 0;
  for (let i = nums.length - 1; i >= 0; i--) {
    temp.unshift(nums[i]);
    flag++;
    if (flag % 3 === 0 && i != 0) {
      temp.unshift(",");
    }
  }
  return temp.join("");
}
```



**URL解析函数**

```javascript
function parseURL(url) {
  url = decodeURI(url);
  let params = url.slice(url.indexOf("?") + 1).split("&");
  let res = {};
  for (const item of params) {
    let curParams = item.split("=");
    res[curParams[0]] = curParams[1];
  }
  return res;
}
```

**以下代码a，b分别是什么，为什么**

```javascript
var a = {k1: 1}
var b = a
a.k3 = a = {k2: 2}
```

**flex布局**

**flex-grow属性**

一个数字，规定项目将相对于其他灵活的项目进行扩展的量。

**CSS画九宫格**

**块级元素和行内元素，并列举一些**

**去除inline-block元素间距**

1. **移除空格**

   ```html
   // 1
   <div>
     <a href="">
     链接1</a><a href="">
     链接2</a><a href="">
     链接3</a><a href="">
     链接4</a>
   </div>
   // 2
   <div>
     <a href="">链接1</a
     ><a href="">链接2</a
     ><a href="">链接3</a
     ><a href="">链接4</a>
   </div>
   // 3
   <div>
     <a href="">链接1</a><!--
     --><a href="">链接2</a><!--
     --><a href="">链接3</a><!--
     --><a href="">链接4</a>
   </div>
   ```

2. 设置父元素font-size:0

3. 使用letter-spacing

   ```html
   <style>
     div {
       letter-spacing: -5px;
     }
     a {
       letter-spacing: 0;
       background: pink;
     }
   </style>
   <div>
     <a href="">链接1</a>
     <a href="">链接2</a>
     <a href="">链接3</a>
     <a href="">链接4</a>
   </div>
   ```

   

**display的属性**

**PC端扫码登陆方案，并需要传递哪些信息**

**webSocket和轮询的比较**

**webSocket安全问题**

**web安全**

**项目亮点**

**自己的优点和缺点**



**个人感受及一些小建议**

面试官不会的会引导，然后自己也要引导面试官朝自己熟悉的方向引，不会的思考一下再说，回答任何问题的时候尽量结合自己的项目回答，类似于：这个东西，我之前做过相关的demo，里面用到了这个啥啥啥的，平时学习或者看面试题尽量深入一些，不能太浅，面试官会问到你不会为止。