<template>
  <el-header>
    <el-menu :default-active="activeIndex" @select="handleSelect" mode="horizontal">
      <el-menu-item index="Search">
        <router-link class="nav-item" to="/">Поиск</router-link>
      </el-menu-item>
      <el-menu-item index="Favorites">
        <router-link class="nav-item" to="/favorites">Избранное</router-link>
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
export default {
  name: 'Nav',
  data: () => ({
    activeIndex: 'Search'
  }),
  methods: {
    handleSelect (key) {
      this.$router.push({ name: key }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.nav-item {
  text-decoration: none;
}
.el-header {
  height: 61px !important;
  background-color: #fff;
}
</style>
