<template>
  <div>
    <el-menu mode="horizontal">
      <el-menu-item index="1">
        <router-link class="label" to="/">STAR WARS</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link class="nav-item" to="/search">Поиск</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link class="nav-item" to="/favorites">Избранное</router-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Nav'
}
</script>

<style scoped>
.nav-item {
  text-decoration: none;
}
.label {
  font-family: 'STARWARS' !important;
  text-decoration: none;
  color: #000 !important;
}
</style>
