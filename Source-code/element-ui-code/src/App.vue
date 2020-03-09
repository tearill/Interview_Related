<template>
  <div id="app">
    <!-- <el-alert 
    title="提示信息文字"
    type="error"
    effect="dark"
    show-icon
    closeText='close'
    @close="showMsg"
    > -->
      <!-- <template v-slot:title>
        <button>title</button>
        <button>sub-title</button>
      </template> -->
      <!-- <button slot="title">title</button> -->
      <!-- description -->
      <!-- 123
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
    </el-alert> -->

    <carousel height="150px">
      <carousel-item v-for="item in 4" :key="item">
        <h3 class="small">{{ item }}</h3>
      </carousel-item>
    </carousel>
    
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import ElAlert from './components/ElAlert.vue'
export default {
  name: 'App',
  components: {
    // ElAlert
    // 'carousel': Carousel
  },
  methods: {
    showMsg() {
      console.log('Msg')
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html, body {
  background-color: green;
}
</style>
