<template>
  <el-main>
    <h1>Избранное</h1>
    <el-row :gutter="10">
      <el-col v-for="(ent, k) in allFavorites" :key="k"
        :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <Card :ent="ent" />
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import Card from '../components/Card'
import { mapGetters } from 'vuex'

export default {
  name: 'Favorites',
  components: {
    Card
  },
  computed: {
    ...mapGetters(['allFavorites'])
  }
}
</script>

<style scoped>
.button {
  float: right;
}
.image {
  width: 100%;
  display: block;
  height: 400px;
  max-height: 400px;
  object-fit: cover;
}
.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.el-card, .finder {
  margin-bottom: 1em;
}
</style>
