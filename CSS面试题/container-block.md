# CSS 包含块  
## margin 和 padding 的计算  
margin 和 padding 的值如果为百分比，它会相对于它的**包含块的宽度**来计算  

## 包含块的确定  
- 如果 position 属性为 static、relative 或 sticky，包含块可能由它最近的祖先块元素的内容区的边缘组成  
- 如果 position 属性为 absolute ，包含块就是由它的最近的 position 的值不是 static （也就是值为fixed, absolute, relative 或 sticky）的祖先元素的内边距区的边缘组成  
- 如果 position 属性是 fixed，在连续媒体的情况下(continuous media)包含块是 viewport ,在分页媒体(paged media)下的情况下包含块是分页区域(page area)  
- 如果 position 属性是 absolute 或 fixed，包含块也可能是由满足以下条件的最近父级元素的内边距区的边缘组成的：  
  1. transform/perspective 不为 none  
  2. will-change: transform/perspective  
  3. filter 不是 none 或者 will-change 是 filter(obly works for firefox)  
  4. contain 是 paint  
