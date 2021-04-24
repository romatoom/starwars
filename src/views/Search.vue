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
              <el-button type="text" class="button">Добавить в избранное</el-button>
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
    links: [],
    findText: '',
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
      e.target.src = 'https://starwars-visualguide.com/assets/img/placeholder.jpg'
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
    // методы для работы Autocomplite
    querySearch (queryString, cb) {
      const links = this.links
      var results = queryString ? links.filter(this.createFilter(queryString)) : links
      cb(results)
    },
    createFilter (queryString) {
      return (link) => {
        return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadAll () {
      return [
        { value: 'vue', link: 'https://github.com/vuejs/vue' },
        { value: 'element', link: 'https://github.com/ElemeFE/element' },
        { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
        { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
        { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
        { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
        { value: 'babel', link: 'https://github.com/babel/babel' }
      ]
    },
    handleSelect (item) {
      console.log(item)
    }
  },
  async mounted () {
    this.links = this.loadAll()
    this.entities = await this.getAllEntities()
    console.log(this.entities)
  }
}
</script>

<style scoped>
.button {
  padding: 0;
  float: right;
}
.image {
  width: 100%;
  display: block;
  max-height: 20em;
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
