<template>
  <el-main>
    <h1>Избранное</h1>
    <el-row :gutter="10">
      <el-col v-for="(ent, k) in allFavorites" :key="k"
        :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="`${ent.imgSrc}`" @error="errLoadImg" loading="lazy" class="image">
          <div style="padding: 14px;">
            <span v-if="ent.type !== 'films'">{{ ent.entity.name }}</span>
            <span v-else>{{ ent.entity.title }}</span>
            <div class="bottom clearfix">
              <el-button @click="deleteFromeFavorites(ent.entity.url)" type="danger" class="button">
                Убрать из избранного
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// import BackendApi from '../assets/js/libs/BackendApi'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Favorites',
  computed: {
    ...mapGetters(['allFavorites'])
  },
  methods: {
    ...mapActions(['deleteFavorite']),
    errLoadImg (e) {
      e.target.src = 'https://i.ibb.co/bbRSQmh/CREATOR-gd-jpeg-v1-0-using-IJG-JPEG-v62-quality-85.jpg'
    },
    deleteFromeFavorites (url) {
      this.deleteFavorite(url)
    }
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
