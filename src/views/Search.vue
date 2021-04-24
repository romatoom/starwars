<template>
  <el-main>
    <h1>Поиск</h1>
    <el-input class="finder" placeholder="Что ищем?" v-model="findText" clearable></el-input>
    <!-- <el-button type='primary' @click='getFilms'>Films</el-button> -->
    <el-row :gutter="10">
      <el-col v-for="(ent, k) in findedEntities" :key="k"
        :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="`${ent.imgSrc}`" @error="errLoadImg" class="image">
          <div style="padding: 14px;">
            <span v-if="ent.type !== 'films'">{{ ent.entity.name }}</span>
            <span v-else>{{ ent.entity.title }}</span>
            <div class="bottom clearfix">
              <el-button @click="addToFavorites(ent.id)" type="primary" class="button">Добавить в избранное</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import BackendApi from '../assets/js/libs/BackendApi'

export default {
  name: 'Search',
  data: () => ({
    findText: '',
    favoritesIDs: [],
    entities: []
  }),
  computed: {
    findedEntities () {
      return this.entities.filter((el) => {
        if (el.type === 'films') {
          return el.entity.title.indexOf(this.findText) === 0
        } else {
          return el.entity.name.indexOf(this.findText) === 0
        }
      })
    }
  },
  methods: {
    errLoadImg (e) {
      e.target.src = 'https://i.ibb.co/bbRSQmh/CREATOR-gd-jpeg-v1-0-using-IJG-JPEG-v62-quality-85.jpg'
    },
    async getAllEntities () {
      // получаем виды сущностей
      const types = await BackendApi.getTypesEntities()
      const entities = []
      let id = 0
      types.forEach(async (type) => {
        const ents = await BackendApi.getEntities(type)
        ents.forEach((ent) => {
          const reg = /\d+/
          const urlId = ent.url.match(reg)
          const urlType = type === 'people' ? 'characters' : type
          const entsObj = {
            id: id++,
            type: type,
            entity: ent,
            imgSrc: `https://starwars-visualguide.com/assets/img/${urlType}/${urlId}.jpg`
          }
          console.log()
          entities.push(entsObj)
        })
      })
      return entities
    },
    addToFavorites (id) {
      this.favoritesIDs.push(id)
      localStorage.setItem('favorites_ids', JSON.stringify(this.favoritesIDs))
    }
  },
  async mounted () {
    this.entities = await this.getAllEntities()
    this.favoritesIDs = JSON.parse(localStorage.getItem('favorites_ids'))
    if (this.favoritesIDs === null) {
      this.favoritesIDs = []
      localStorage.setItem('favorites_ids', JSON.stringify(this.favoritesIDs))
    }
    console.log(this.favoritesIDs)
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
