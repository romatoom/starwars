<template>
  <el-header>
    <el-menu :default-active="activeLink" :router="true" mode="horizontal">
      <el-menu-item index="/" :route="{ name: 'Search'}" class="nav-item">
        Поиск
      </el-menu-item>
      <el-menu-item index="/favorites" :route="{ name: 'Favorites'}" class="nav-item">
        Избранное
      </el-menu-item>
    </el-menu>
  </el-header>
</template>

<script>
export default {
  name: 'Nav',
  data: () => ({
    activeLink: 'Search'
  }),
  watch: {
    $route (to, from) {
      this.activeLink = to.path
    }
  },
  mounted () {
    this.activeLink = this.$route.path
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
