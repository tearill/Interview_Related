# Element-ui 源码分析  

## `<el-badge>`组件  

- 分析需求  

- 注意的点  
  1. props 可以是多种类型的值，使用数组的形式对类型进行验证  
     `value: [String, Number]`  
  2. 代码健壮性考虑  
     数字的位置有可能不一定是在右上角，交给用户来决定  
     is-fixed 当作动态类名添加 `'is-fixed': $slots.default`  
  3. 数值的 props  
     不直接使用用户传的 value，进行一定的处理再输出(用户的输入是不可靠的)  
     框定最大值、判断 value 是否有效、非数字的情况  