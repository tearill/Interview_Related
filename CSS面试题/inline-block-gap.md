# 去除 inline-block 元素间距  
## 元素之间间距的产生原因  
元素被当成行内元素排版的时候，元素之间的空白符（空格、回车换行等）都会被浏览器处理  
HTML 代码中的回车换行被转成一个空白符，在字体不为 0 的情况下，空白符占据一定宽度，所以 inline-block 的元素之间就出现了空隙  

## 解决方案  
### 1. 移除空格  
```html
<div>
  <a href="">
  链接1</a><a href="">
  链接2</a><a href="">
  链接3</a><a href="">
  链接4</a>
</div>
```

```html
<div>
  <a href="">链接1</a
  ><a href="">链接2</a
  ><a href="">链接3</a
  ><a href="">链接4</a>
</div>
```

```html
<div>
  <a href="">链接1</a><!--
  --><a href="">链接2</a><!--
  --><a href="">链接3</a><!--
  --><a href="">链接4</a>
</div>
```

### 2. 使用 margin 负值  
```html
<style>
  a {
    background: pink;
    display: inline-block; 
    padding: .5em 1em;
    margin: -3px;
  }
</style>
<body>
  <div>
    <a href="">链接1</a>
    <a href="">链接2</a>
    <a href="">链接3</a>
    <a href="">链接4</a>
  </div>
</body>
```

### 3. 设置父元素 font-size:0  
```html
<style>
  div {
    font-size: 0;
  }
  a {
    font-size: 16px;
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

### 4. 删掉闭合标签  
```html
<div>
  <a href="">链接1
  <a href="">链接2
  <a href="">链接3
  <a href="">链接4
</div>
```

### 5. letter-spacing  
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

### 6. word-spacing  
```html
<style>
  div {
    word-spacing: -5px;
  }
  a {
    word-spacing: 0;
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

## display:inline-block 元素和父元素上下存在间隙，产生原因及解决方案  
