<template>
  <button
    class="el-button"
    @click="handleClick"
    :type="nativeType"
    :disabled="buttonDisabled || loading"
    :class="[
      type ? 'el-button--' + type : '',
      {
        'is-round': round,
        'is-plain': plain,
        'is-loading': loading,
        'is-disabled': buttonDisabled
      }
    ]"
    >
    <i class="el-icon-loading" v-if="loading"></i>
    <!-- 加上 !loading 放置加载图标和原本的图标重复产生歧义 -->
    <i v-if="icon && !loading" :class="icon"></i>
    <!-- 如果只有 icon -->
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'ElButton',
  props: {
    type: {
      type: String,
      default: 'default'
    },
    round: {
      type: Boolean,
      default: false
    },
    plain: {
      type: Boolean,
      default: false
    },
    icon: String,
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event)
    }
  },
  computed: {
    buttonDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    }
  }
}
</script>

<style>

</style>