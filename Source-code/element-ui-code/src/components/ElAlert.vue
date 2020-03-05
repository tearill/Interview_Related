<template>
  <div>
    <!-- ElAlert -->
    <transition name="el-alert-fade">
      <div
        class="el-alert"
        :class="[ typeClass, center ? 'is-center' : '', 'is-' + effect ]"
        v-show="visible"
        >
        <i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
        <div class="el-alert__content">
          <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title || $slots.title">
            <!-- {{title}} -->
            <!-- 属性和具名插槽两种方式显示 -->
            <slot name="title">{{title}}</slot>
          </span>
          <!-- 通过 slot:default 显示 description -->
          <p class="el-alert__description" v-if="$slots.default && !description"><slot></slot></p>
          <!-- 通过属性显示 description -->
          <p class="el-alert__description" v-if="!$slots.default && description">{{ description }}</p>
          <!-- <p class="el-alert__description" v-if="description || $slots.default">{{ description }}</p> -->
          <i class="el-alert__closebtn" :class="{ 'is-customed' : closeText!== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{ closeText }}</i>
        </div>  
      </div>
    </transition>
  </div>
</template>

<script type="text/babel">
// 常量 
const TYPE_CLASS_MAP = {
  'success': 'el-icon-success',
  'warning': 'el-icon-warning',
  'error': 'el-icon-error'
}
export default {
  name: 'ElAlert',
  props: {
    type: { // 类型
      type: String,
      default: 'info' // 默认值
    },
    title: { // 标题
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    center: Boolean,
    effect: { // 提供的主题
      type: String,
      default: 'light',
      validator: function(value) { // 验证 effect 的值必须二选一
        // 其中之一
        return ['light', 'dark'].indexOf(value) !== -1;
      }
    },
    showIcon: Boolean,
    closeText: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: true
    }
  },
  computed: {
    // 计算属性
    typeClass() {
      return `el-alert--${ this.type }`
    },
    iconClass() {
      return TYPE_CLASS_MAP[this.type] || 'el-icon-info'
    },
    isBigIcon() {
      return this.desciption || this.$slots.default ? 'is-big' : ''
    },
    isBoldTitle() {
      return this.description || this.$slots.default ? 'is-bold' : ''
    }
  },
  methods: {
    close() {
      this.visible = false;
      // 给父组件传递一个 close 方法，便于在用户关闭提示的时候进行一些操作
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>