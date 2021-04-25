<template>
  <el-card :body-style="{ padding: '0px' }">
    <img :src="`${ent.imgSrc}`" @error="errLoadImg" loading="lazy" class="image">
    <div style="padding: 14px;">
      <span v-if="ent.type !== 'films'"><strong>{{ ent.entity.name }}</strong></span>
      <span v-else><strong>{{ ent.entity.title }}</strong></span>: {{ translateTE(ent.type) }}
      <div class="bottom clearfix">
        <el-button v-if="!(allFavoritesURLs.includes(ent.entity.url))" @click="addToFavorites(ent.entity.url)" type="primary" class="button">
          Добавить в избранное
        </el-button>
        <el-button v-else @click="deleteFromeFavorites(ent.entity.url)" type="danger" class="button">
          Убрать из избранного
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import translateTypeEntities from '../assets/js/libs/translate'

export default {
  name: 'Card',
  props: {
    ent: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(['allFavoritesURLs'])
  },
  methods: {
    ...mapActions(['addFavorite', 'deleteFavorite']),
    translateTE (type) {
      return translateTypeEntities(type)
    },
    errLoadImg (e) {
      e.target.src = 'https://i.ibb.co/bbRSQmh/CREATOR-gd-jpeg-v1-0-using-IJG-JPEG-v62-quality-85.jpg'
    },
    addToFavorites (url) {
      this.addFavorite(url)
    },
    deleteFromeFavorites (url) {
      this.deleteFavorite(url)
    }
  },
  mounted () {
    this.activeLink = this.$route.path
  }
}
</script>

<style scoped>
.button {
  position: absolute;
  bottom: 1em;
  right: 1em;
}
.image {
  width: 100%;
  display: block;
  height: 300px;
  max-height: 300px;
  object-fit: cover;
}
.clearfix:before, .clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.el-card {
  margin-bottom: 1em;
}
.el-card {
  position: relative;
  height: 450px;
  max-height: 450px;
}
</style>
