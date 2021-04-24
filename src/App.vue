<template>
  <div id="app">
    <Nav />
    <router-view/>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'

export default {
  components: {
    Nav
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
