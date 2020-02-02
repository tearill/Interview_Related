# 字节跳动面试题

## 手撕算法 
   参考掘金原文👉https://juejin.im/post/5ddfa3def265da05ef59fe6e

- 有效的括号  

  leetcode 20👉https://leetcode-cn.com/problems/valid-parentheses/  

  使用栈，左边括号入栈，右边括号匹配左括号出栈，最后判断栈是否为空  
  当右边括号是第一个元素，或者是栈里没有可以用来匹配的左括号元素，提前判断不是有效的括号  

  - 优化  
    时间复杂度O(n)  空间复杂度O(n)
    把空间复杂度优化成O(1)

- 最长有效括号匹配长度  

  leetcode 32👉https://leetcode-cn.com/problems/longest-valid-parentheses/  

  动态规划思想  

  1. 暴力法  
     使用嵌套循环，每位符号(外层循环)，它的最大有效长度是多少(内层循环)  tmpMax
     求一个max 
     时间复杂度为O(n^2)  
  2. 将时间复杂度降低  
     tmpMax 来计算，左右括号，下标之间做减法  
     ())(()) 
     一次遍历  i 下标 0  
     -1 哨兵元素 0 - (-1)  
     栈为空时，提前退出 2 前面的匹配的长度  
     省循环的根本，重新再来  
  3. 再优化  
     存下标，时间复杂度O(n) 不太可能再减少  
     空间复杂度？stack O(n) -> O(1) 不能使用栈  
     left right 遍历中记录 '(' 和 ')' 的数量 O(1)  
     1. () 2*right max  
     2. left < right  ()) 有效匹配结束 left = right = 0  
     