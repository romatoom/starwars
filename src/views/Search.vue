<template>
  <el-main>
    <h1>Поиск</h1>
    <el-input class="finder" placeholder="Что ищем?" v-model="findText" clearable></el-input>
    <!-- <el-button type='primary' @click='getFilms'>Films</el-button> -->
    <el-row :gutter="10">
      <el-col v-for="(ent, k) in findedEntities" :key="k"
        :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
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
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import translateTypeEntities from '../assets/js/libs/translate'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Search',
  data: () => ({
    findText: ''
    /* favoritesURLs: [],
    entities: [] */
  }),
  computed: {
    ...mapGetters(['allEntities', 'allFavoritesURLs']),
    findedEntities () {
      return this.allEntities.filter((el) => {
        if (el.type === 'films') {
          return el.entity.title.toUpperCase().indexOf(this.findText.toUpperCase()) === 0
        } else {
          return el.entity.name.toUpperCase().indexOf(this.findText.toUpperCase()) === 0
        }
      })
    }
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
.el-card, .finder {
  margin-bottom: 1em;
}
.el-card {
  position: relative;
  height: 450px;
  max-height: 450px;
}
</style>
