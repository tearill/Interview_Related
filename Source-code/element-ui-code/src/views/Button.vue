<template>
  <div>
    <el-button 
    round 
    nativeType="reset"
    type="success" 
    plain
    @click="upload"
    loading
    >按钮</el-button>

    <el-button icon="el-icon-check"></el-button>

    <el-button 
    round
    type="message" 
    @click="upload"
    icon="el-icon-edit"
    loading
    >上传按钮</el-button>

    <el-button 
    type="text" 
    >文本</el-button>

    <el-button type="primary" disabled>上传<i class="el-icon-upload el-icon--right"></i></el-button>
  </div>
</template>

<script>
import ElButton from '../components/ElButton.vue'
export default {
  name: 'el-button--show',
  components: {
    ElButton
  },
  methods: {
    upload(event) {
      console.log(event)
    }
  }
}
</script>

<style>

</style>