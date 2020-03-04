# Element-ui 源码分析  

- 边看源码边学  
- 样式引入留下 Vue.use(ElementUI)注释  
- BEM 命名规范


## `<el-alert>` 组件  

- 学到代码风格  
  属性一行一个，有利于代码可读性  
  适当地使用空格  
- :class 的用法  
  1. [] 表示有多个动态样式要输出  
  2. {} 表示有多个动态样式要输出  
  3. computed 属性，根据 props 再计算，格式化一下  
  
- props 高级声明  
  1. 声明类型进行检验  
    ```js
    type: { // props name
      type: String, // 类型
      default: '默认值' // 默认值
    }
    ```
  ['type', 'title'] -> 粗线条的，不能进行太多的检验  
  2. 声明 validate 方法进行检验  
    ```js
    effect: {
      type: String,
      default: 'light',
      validator: function(value) {
        // 其中之一
        return ['light', 'dark'].indexOf(value) !== -1;
      }
    }
    ```
- TYPE_CLASS_MAP  
  (和大文件上传中的状态的处理方式一样)  
  将可遍历的同一个类型的数据作为 JSON 常量保存，维护性更好，可以做到一改全改  
- 给用户多种选项  
  1. title  
    ```html
    <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title || $slots.title">
      <slot name="title">{{title}}</slot>
    </span>
    ```
    通过 `v-if="title || $slots.title"` 实现判断  
    显示 title 的两种情况：
     + 第一种是传了 title 属性，直接放到插槽中显示  
     + 第二种是没传 title 属性，但是通过 title 的插槽传递 title 替换子组件中的 {{title}}  
  2. description  
    ```html
    <!-- 通过 slot:default 显示 description -->
    <p class="el-alert__description" v-if="$slots.default && !description"><slot></slot></p>
    <!-- 通过属性显示 description -->
    <p class="el-alert__description" v-if="!$slots.default && description">{{ description }}</p>
    ```
    可以通过属性和默认插槽两种方式传值进去显示 description  
    这里不能写成和 title 那样使用 v-if 来实现两种方式的显示，因为这里的插槽是默认插槽，无法通过 $slots.default 进行判断    