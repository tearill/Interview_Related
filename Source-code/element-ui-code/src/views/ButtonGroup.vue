<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
      <el-button type="primary">下一页<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    </el-button-group>
    <hr />
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit"></el-button>
      <el-button type="primary" icon="el-icon-share"></el-button>
      <el-button type="primary" icon="el-icon-delete"></el-button>
    </el-button-group>
  </div>
</template>

<script>
import ElButtonGroup from '../components/ElButtonGroup.vue'
import ElButton from '../components/ElButton.vue'

export default {
  name: 'el-button-group--show',
  components: {
    ElButtonGroup,
    ElButton
  }
}
</script>

<style>

</style>