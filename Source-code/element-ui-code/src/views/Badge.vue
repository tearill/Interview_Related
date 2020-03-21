<template>
  <div>
    <el-badge :value="12" class="item">
      <el-button size="small">评论</el-button>
    </el-badge>
    <hr />
    <el-badge :value="101" :max="99" class="item">
      <el-button size="small">评论</el-button>
    </el-badge>
    <hr />
    <el-badge type="warning" value="new" class="item">
      <el-button size="small">评论</el-button>
    </el-badge>
    <hr />
    <el-badge is-dot class="item" :hidden="isHiddenDot">数据查询</el-badge>
  </div>
</template>

<script>
import ElBadge from '../components/ElBadge.vue'
import ElButton from '../components/ElButton.vue'

export default {
  name: "Badge",
  data() {
    return {
      isHiddenDot: false
    }
  },
  components: {
    ElBadge,
    ElButton
  },
  mounted() {
    setTimeout(() => {
      this.isHiddenDot = true
    }, 3000)
  }
}
</script>

<style>

</style>