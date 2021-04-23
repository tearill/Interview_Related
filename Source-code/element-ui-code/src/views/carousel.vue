<template>
  <div class="carousel">
    <carousel height="150px">
      <carousel-item v-for="item in 4" :key="item">
        <h3 class="small">{{ item }}</h3>
      </carousel-item>
    </carousel>
  </div>
</template>

<script>
export default {
  name: 'carousel_show'
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.carousel {
  background-color: #42b983;
}
</style>