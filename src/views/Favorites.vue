
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
        style="width: 100%; padding: 1em;">
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
      <el-tree :data="dataTree" :props="defaultProps" node-key="id" style="padding: 1em;">
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
        text: 'ФОРМИРОВАНИЕ ИЗБРАННОГО В ВИДЕ ДЕРЕВА',
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

    // метод для формирования дерева избранного
    async updateDataTree () {
      try {
        this.dataTree = [] // данные для элемента Tree
        const entytiesDatas = [] // список сущностей, их типов и фильмов, где они встречаются + url избранного

        // формирование entytiesDatas
        const promises = this.allFavorites.map(async (fav) => {
          let nameEnt
          const typeEnt = fav.type
          if (typeEnt !== 'films') {
            nameEnt = fav.entity.name
            const promises = fav.entity.films.map(async (filmURL) => {
              const film = await BackendApi.getEntityByURL(filmURL)
              entytiesDatas.push({ nameEnt, typeEnt: this.translateTE(typeEnt), filmEnt: film.title, url: fav.entity.url })
            })
            await Promise.all(promises)
          } else {
            nameEnt = fav.entity.title
            entytiesDatas.push({ nameEnt, typeEnt: this.translateTE(typeEnt), filmEnt: fav.entity.title, url: fav.entity.url })
          }
        })
        await Promise.all(promises)

        let time = performance.now()
        // сортируем entytiesDatas
        entytiesDatas.sort((prev, next) => {
          let compare
          if (prev.filmEnt > next.filmEnt) {
            compare = 1
          } else if (prev.filmEnt < next.filmEnt) {
            compare = -1
          } else if (prev.typeEnt > next.typeEnt) { // Если фильмы одинаковые сравниваем типы сущностей
            compare = 1
          } else if (prev.typeEnt < next.typeEnt) {
            compare = -1
          } else if (prev.nameEnt > next.nameEnt) { // Если виды сущностей одинаковые сравниваем названия сущностей
            compare = 1
          } else if (prev.nameEnt < next.nameEnt) {
            compare = -1
          } else {
            compare = 0 // на всякий случай, но вряд ли выполнится, так как нет одинаковых элементов :-)
          }
          return compare
        })

        // формируем данные для Tree
        if (entytiesDatas.length > 0) {
          let film = entytiesDatas[0].filmEnt
          let type = entytiesDatas[0].typeEnt
          let name = entytiesDatas[0].nameEnt
          let url = entytiesDatas[0].url
          let childrenFilm = []
          let childrenType = []
          childrenType.push({ label: name, url })

          entytiesDatas.forEach((entData) => {
            if (entData.filmEnt !== film) { // следующий фильм - записываем предыдущие данные
              childrenType.push({ label: name, url: url })
              childrenFilm.push({ label: type, children: childrenType })
              this.dataTree.push({ label: film, children: childrenFilm })
              childrenFilm = []
              childrenType = []
              film = entData.filmEnt
              type = entData.typeEnt
              name = entData.nameEnt
              url = entData.url
            } else { // этот же текущий фильм
              if (entData.typeEnt !== type) { // следующий тип сущности - записываем предыдущие данные
                childrenType.push({ label: name, url: url })
                childrenFilm.push({ label: type, children: childrenType })
                childrenType = []
                type = entData.typeEnt
                name = entData.nameEnt
                url = entData.url
              } else { // этот же тип сущности
                if (entData.nameEnt !== name) { // следущее название сущности текущего типа сущности
                  childrenType.push({ label: name, url: url })
                  name = entData.nameEnt
                  url = entData.url
                }
              }
            }
          })
          // записываем данные последней записи
          childrenType.push({ label: name, url: entytiesDatas[entytiesDatas.length - 1].url })
          childrenFilm.push({ label: type, children: childrenType })
          this.dataTree.push({ label: film, children: childrenFilm })
        }
        time = performance.now() - time
        console.log('Время выполнения = ', time)
      } catch (err) {
        console.error(err)
      }
    },
    // первоначальный вариант метода для формирования дерева избранного
    async updateDataTree2 () {
      try {
        this.dataTree = [] // данные для элемента Tree
        const filmsTitles = [] // список уникальных названий фильмов
        const entytiesDatas = [] // список сущностей, их типов и фильмов, где они встречаются + url избранного

        const promises = this.allFavorites.map(async (fav) => {
          let nameEnt
          const typeEnt = fav.type
          if (typeEnt !== 'films') {
            nameEnt = fav.entity.name
            const promises = fav.entity.films.map(async (filmURL) => {
              const film = await BackendApi.getEntityByURL(filmURL)
              entytiesDatas.push({ nameEnt, typeEnt: this.translateTE(typeEnt), filmEnt: film.title, url: fav.entity.url })
              // добавляем уникальные названия фильмов
              if (!filmsTitles.includes(film.title)) filmsTitles.push(film.title)
            })
            await Promise.all(promises)
          } else {
            nameEnt = fav.entity.title
            entytiesDatas.push({ nameEnt, typeEnt: this.translateTE(typeEnt), filmEnt: fav.entity.title, url: fav.entity.url })
            // добавляем уникальные названия фильмов
            if (!filmsTitles.includes(fav.entity.title)) filmsTitles.push(fav.entity.title)
          }
        })
        await Promise.all(promises)

        let time = performance.now()
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
              childrenFilm.push({ label: entData.typeEnt, children: childrenType })
            }
          })
          const filmObj = { label: filmTitle, children: childrenFilm }
          this.dataTree.push(filmObj)
        })
        time = performance.now() - time
        console.log('Время выполнения = ', time)
      } catch (err) {
        console.error(err)
      }
    }
  },
  async created () {
    /* const loading = this.$loading({
      lock: true,
      text: 'ФОРМИРОВАНИЕ ИЗБРАННОГО (ОБНОВЛЕНИЕ ДАННЫХ)',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    }) */
    await this.updateDataTree()
    /* loading.close() */
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
