<template>
  <div>
    <!-- CarouselItem -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  // name 属性不可或缺
  name: 'CarouselItem',
  created() { // 放在 created 中处理可以更快的更新
    console.log(this.$parent)
    // 如果是放在 carousel 之中出现的 
    // if (this.$parent) {

    // }
    this.$parent && this.$parent.updateItems() // 通知父组件增加一项
  }
}
</script>