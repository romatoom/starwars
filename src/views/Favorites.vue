
<template>
  <el-main>
    <h1>Избранное</h1>
    <div class="label">Вид:</div>
    <el-radio-group v-model="view" style="margin-bottom: 30px;">
      <el-radio-button label="Список"></el-radio-button>
      <el-radio-button label="Галерея"></el-radio-button>
      <el-radio-button label="Дерево"></el-radio-button>
    </el-radio-group>
    <!-- СПИСОК -->
    <template v-if="view === 'Список'">
      <el-table
        :data="allFavorites"
        stripe
        style="width: 100%">
        <el-table-column
          label="Название сущности"
          width="auto">
          <template slot-scope="scope">
            <template v-if="scope.row.type !== 'films'">
            {{ scope.row.entity.name }}
            </template>
            <template v-else>
              {{ scope.row.entity.title }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="Тип сущности"
          width="auto">
          <template slot-scope="scope">
            {{ translateTE((scope.row.type)) }}
          </template>
        </el-table-column>
        <el-table-column
          label="Действие"
          width="200">
          <template slot-scope="scope">
            <el-button @click="deleteFavorite(scope.row.entity.url)"
              type="danger" class="button">
              Убрать из избранного
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- СПИСОК -->
    <template v-else-if="view === 'Галерея'">
      <el-row :gutter="10">
        <el-col v-for="(ent, k) in allFavorites" :key="k"
          :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
          <Card :ent="ent" />
        </el-col>
      </el-row>
    </template>
    <!-- ДЕРЕВО -->
    <template v-else>
      <el-tree :data="dataTree" :props="defaultProps" node-key="id">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span v-if="data.url !== undefined">
            <el-button
              type="text"
              size="mini"
              @click="deleteFavorite(data.url)">
              Убрать из избранного
            </el-button>
          </span>
        </span>
      </el-tree>
    </template>
  </el-main>
</template>

<script>
import Card from '../components/Card'
import { mapGetters, mapActions } from 'vuex'
import translateTypeEntities from '../assets/js/libs/translate'
import BackendApi from '../assets/js/libs/BackendApi'

export default {
  name: 'Favorites',
  data: () => ({
    view: 'Список',
    dataTree: [],
    defaultProps: {
      children: 'children',
      label: 'label',
      url: 'url'
    }
  }),
  components: {
    Card
  },
  watch: {
    allFavorites: async function () {
      const loading = this.$loading({
        lock: true,
        text: 'ФОРМИРОВАНИЕ ИЗБРАННОГО (ОБНОВЛЕНИЕ ДАННЫХ)',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      await this.updateDataTree()
      loading.close()
    }
  },
  computed: {
    ...mapGetters(['allFavorites', 'allFavoritesURLs'])
  },
  methods: {
    ...mapActions(['deleteFavorite']),
    translateTE (type) {
      return translateTypeEntities(type)
    },
    async updateDataTree () {
      try {
        this.dataTree = [] // данные для элемента Tree
        const filmsTitles = [] // список уникальных названий фильмов
        const entytiesDatas = [] // список сущностей, их типов и фильмов, где они встречаются + url избранного

        const promises = this.allFavorites.map(async (fav) => {
          let nameEnt
          if (fav.type !== 'films') {
            nameEnt = fav.entity.name
          } else {
            nameEnt = fav.entity.title
          }
          const typeEnt = fav.type
          const promises = fav.entity.films.map(async (filmURL) => {
            const film = await BackendApi.getEntityByURL(filmURL)
            entytiesDatas.push({ nameEnt, typeEnt, filmEnt: film.title, url: fav.entity.url })
            // добавляем уникальные названия фильмов
            if (!filmsTitles.includes(film.title)) filmsTitles.push(film.title)
          })
          await Promise.all(promises)
        })
        await Promise.all(promises)

        filmsTitles.forEach((filmTitle) => {
          const typeEntities = [] // список уникальных типов сущностей
          const childrenFilm = []
          entytiesDatas.forEach((entData) => {
            // добаваляем уникальные типы сущностей
            if (filmTitle === entData.filmEnt && !typeEntities.includes(entData.typeEnt)) {
              const childrenType = []
              const type = entData.typeEnt
              entytiesDatas.forEach((entData2) => {
                if (filmTitle === entData2.filmEnt && type === entData2.typeEnt) {
                  childrenType.push({ label: entData2.nameEnt, url: entData2.url })
                }
              })
              typeEntities.push(entData.typeEnt)
              childrenFilm.push({ label: this.translateTE(entData.typeEnt), children: childrenType })
            }
          })
          // console.log(childrenFilm)
          // console.log('typeEntities', typeEntities)
          const filmObj = { label: filmTitle, children: childrenFilm }
          this.dataTree.push(filmObj)
        })
      } catch (err) {
        console.error(err)
      }
    }
  },
  async mounted () {
    const loading = this.$loading({
      lock: true,
      text: 'ФОРМИРОВАНИЕ ИЗБРАННОГО (ОБНОВЛЕНИЕ ДАННЫХ)',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    await this.updateDataTree()
    loading.close()
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
.label {
  color: #fff;
  font-size: 1em;
  margin-bottom: 0.5em;
}
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
