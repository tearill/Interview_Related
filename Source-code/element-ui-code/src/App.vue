<template>
  <div id="app">
    <h1><router-link to="/">组件列表</router-link></h1>
    <div id="nav">
      <router-link to="/el-alert">el-alert</router-link> |
      <router-link to="/carousel">carousel</router-link> |
      <router-link to="/button">Button</router-link> 
    </div>
    <router-view/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
export default {
  name: 'App',
  components: {
    // ElAlert
    // 'carousel': Carousel
  }
}
</script>

<style lang="less">
// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

h1 {
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

</style>