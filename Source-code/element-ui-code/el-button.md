# Element-ui 源码分析  

## `<el-button>`组件  

- 分析  
  type 生成不同的类名 -> computed  
  is-plain is-round -> :class  
  icon  
  slot v-if -> 文字  

- 注意的点  
  1. 当通过是否传 props 来控制类名的添加可以通过 JSON 的方式实现，尤其是在判断的动态类名比较多的情况下  
     ```js
     {
      'is-round': round,
      'is-plain': plain,
      'is-loading': loading,
      'is-disabled': buttonDisabled
     }
     ```
  2. 考虑全面 => 当按钮处于加载状态下会显示加载图标，如果用户设置了按钮的图标，显示两个图标会产生歧义  
     添加 v-if 进行控制一次只显示一个图标防止产生歧义：  
     `<i v-if="icon && !loading" :class="icon"></i>`  
  3. 考虑用户只设置按钮 icon，不设置按钮的文字的情况  
     `<span v-if="$slots.default"><slot></slot></span>`  
  4. 全局考虑  
     ```js
     buttonDisabled() {
       return this.disabled || (this.elForm || {}).disabled;
     }
     ```
     判断按钮不可用的时候，考虑到其他组件(表单)禁用的时候按钮也要禁用  