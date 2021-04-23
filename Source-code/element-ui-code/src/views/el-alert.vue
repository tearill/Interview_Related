<template>
  <div>
    <el-alert 
    title="提示信息文字"
    type="error"
    effect="dark"
    show-icon
    closeText='close'
    @close="showMsg"
    >
      <template v-slot:title>
        <!-- <button>title</button>
        <button>sub-title</button> -->
      </template>
      <button slot="title">title</button>
      <!-- description
      123 -->
    </el-alert>
    <el-alert
    title="成功提示的文案"
    type="success"
    
    description="文字说明文字说明文字说明文字说明文字说明文字说明"
    show-icon>
    </el-alert>
    <el-alert
    title="带辅助性文字介绍"
    type="success"
    show-icon
    description="这是一句绕口令：黑灰化肥会挥发发灰黑化肥挥发；灰黑化肥会挥发发黑灰化肥发挥。 黑灰化肥会挥发发灰黑化肥黑灰挥发化为灰……">
    </el-alert> 
  </div>
</template>

<script>
import ElAlert from '../components/ElAlert.vue'

export default {
  name: 'al-alert--show',
  methods: {
    showMsg() {
      console.log('Msg')
    }
  },
  components: {
    ElAlert
  }
}
</script>

<style>

</style>