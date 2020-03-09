<template>
  <div
  :class="carouselClasses">
    <!-- Carousel -->
    <div
      class="el-carousel-container"
      :style="{ height: height }"
      >
      <slot></slot>
    </div>
    <ul 
      :class="indicatorsClasses">
      <!-- 有多少个 carousel-item 就输出多少个 indicator -->
      <li 
        v-for="(item, index) in items"
        :key="index"
        :class="[
          'el-carousel__indicator',
          'el-carousel__indicator--' + direction,
          { 'is-active': index === activeIndex }]">
        <button class="el-carousel__button">
          <!-- <span v-if="hasLabel">{{ item.label }}</span> -->
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  // name 属性不可或缺
  name: 'Carousel',
  data() {
    return {
      items: [] // 开始为空, 数据源从哪里来
    }
  },
  props: {
    height: String,
    direction: {
      type: String,
      default: 'horizontal',
      validator(val) {
        // 传的值只能是其中之一
        return ['horizontal', 'vartical'].indexOf(val) !== -1
      }
    }
  },
  computed: {
    carouselClasses() { // 根据方向动态设置类名
      const classes = ['el-carousel', 'el-carousel--' + this.direction]
      // Vue 中 :class 支持单个、JSON、数组的形式
      if (this.type === 'card') {
        classes.push('el-carousel--card')
      }
      return classes
    },
    indicatorsClasses() {
      const classes = ['el-carousel__indicators', 'el-carousel__indicators--' + this.direction]
      return classes
    }
  },
  methods: {
    updateItems() { // 通过子组件的创建来更新循环(轮播图的indicator)数量
      // console.log('------')
      console.log(this.$children) // 所有的子组件
      // 去除掉组件中不是 carousal-item 的部分
      this.items = this.$children.filter(child => child.$options.name === 'CarouselItem')
    }
  }
}
</script>