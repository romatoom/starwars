<template>
  <div id="app">
    <Nav />
    <router-view/>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Nav
  },
  computed: {
    ...mapGetters(['allEntities', 'allFavorites'])
  },
  methods: {
    ...mapActions(['loadAllEntities', 'loadFavorites'])
  },
  async mounted () {
    // загружаем сущности
    if (this.allEntities.length === 0) {
      const loading = this.$loading({
        lock: true,
        text: 'ЗАГРУЗКА СУЩНОСТЕЙ STARWARS',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.loadAllEntities()
      loading.close()
    }
    // загружаем избранное
    if (this.allFavorites.length === 0) {
      this.loadFavorites()
    }
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
