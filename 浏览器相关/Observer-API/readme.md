# 现代浏览器部分 Observer API  
图片懒加载  
伪代码  
```js
window.addEventListener('scroll', () => {
  // 计算有没有出现在视窗之内
})
// 出现的时候 -> 主动告诉我
```

- IntersectionObserver 交叉观察者  
  被用户看到：这个元素出现的比例到到什么程序才叫被用户看到  

- MutationObserver 变动观察者  
  观察 DOM 节点是否变动  