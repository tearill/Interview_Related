# flex 布局  
## flex-shrink 计算  
**值乘自身宽度的比**  
- left + right > flex 盒子的宽度 => flex 盒子不够容纳里面的内容 => 剩余不足  
  flex-shrink 2:1  
  1. 500 + 400 - 600 = 300 => 超出部分  
  2. left、right 分担    
    超出部分的比例 500 * 2 : 400 * 1 => 5:2  
  3. left: 500 - 300*5/7 = 285.72
  4. right: 400 - 300*2/7 = 314.29  

- 加上 padding 的计算  
  计算方式改变  
  1. 500 + 2 * 40 + 400 + 2 * 20 - 600 = 420  
  2. 分配比例不包括 padding 的值 => 超出部分的比例 500 * 2 : 400 * 1 => 5:2    
  3. left: 580 - 420*5/7 = 280  
  4. right: 440 - 420*2/7 = 320  

- padding + box-sizing: border-box  
  1. IE 盒模型  
  2. 超出部分：500 + 400 - 600 = 300  
  3. 超出部分分配比例 => 500 - 2 * 40 * 2 : 400 - 2 * 20 * 1 => 7 : 3  
  4. left: 500 - 300 * 7 / 10 = 290  
  5. right: 400 - 300 * 3 / 10 = 210  

## 设置在容器上的 6 个属性  
- flex-direction
- flex-wrap
- flex-flow
- justify-content
- align-items
- align-content

## 设置在项目上的属性  


## flex: 0  
flex: 0  
flex 属性是 flex-grow, flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto，后两个属性可选  
