# ES6 中的 let 和 const  

let 是更完美的 var, 所以尽可能的用 let  
let 声明的变量用于块级作用域  
let 声明的全局变量不是全局对象的属性, 意味着无法使用 window 来访问 let 声明的变量  
let 也有提升特性，但是你在声明之前使用，就会报引用错误（ReferenceError）  
let 重定义变量回报语法错误，但是 var 不会  

const 不可以修改  
const 定义时需要赋值  

## 小结  
1. 不会被提升  
2. 重复声明报错  
3. 不绑定全局作用域  

## 临时死区(Temporary Dead Zone)  
 JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部(遇到 var 声明)，要么将声明放在 TDZ 中(遇到 let 和 const 声明)  
 访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问