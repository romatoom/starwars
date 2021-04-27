
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
            <el-button v-if="!(allFavoritesURLs.includes(scope.row.entity.url))"
              @click="addFavorite(scope.row.entity.url)" type="primary" class="button">
              Добавить в избранное
            </el-button>
            <el-button v-else @click="deleteFavorite(scope.row.entity.url)"
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
      <el-tree :data="dataTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
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
    dataT: [
      {
        label: 'Level one 1',
        children: [{
          label: 'Level two 1-1',
          children: [{
            label: 'Level three 1-1-1'
          }]
        }]
      }, {
        label: 'Level one 2',
        children: [{
          label: 'Level two 2-1',
          children: [{
            label: 'Level three 2-1-1'
          }]
        }, {
          label: 'Level two 2-2',
          children: [{
            label: 'Level three 2-2-1'
          }]
        }]
      }, {
        label: 'Level one 3',
        children: [{
          label: 'Level two 3-1',
          children: [{
            label: 'Level three 3-1-1'
          }]
        }, {
          label: 'Level two 3-2',
          children: [{
            label: 'Level three 3-2-1'
          }]
        }]
      }
    ],
    defaultProps: {
      children: 'children',
      label: 'label'
    }
  }),
  components: {
    Card
  },
  watch: {
    allFavorites: async function () {
      await this.updateDataTree()
    }
  },
  computed: {
    ...mapGetters(['allFavorites', 'allFavoritesURLs'])
  },
  methods: {
    ...mapActions(['addFavorite', 'deleteFavorite']),
    translateTE (type) {
      return translateTypeEntities(type)
    },
    handleNodeClick (data) {
      console.log(data)
    },
    async updateDataTree () {
      try {
        this.dataTree = [] // данные для элемента Tree
        const filmsTitles = [] // список уникальных названий фильмов
        const entytiesDatas = [] // список сущностей, их типов и фильмов, где они встречаются

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
            entytiesDatas.push({ nameEnt, typeEnt, filmEnt: film.title })
            // добавляем уникальные названия фильмов
            if (!filmsTitles.includes(film.title)) filmsTitles.push(film.title)
          })
          await Promise.all(promises)
        })
        await Promise.all(promises)

        console.log('entytiesDatas', entytiesDatas)
        console.log('filmsTitles', filmsTitles)
        // console.log('typeEntities', typeEntities)

        /* entytiesDatas.forEach((entData) => {
          const typeEntities = [] // список уникальных типов сущностей
          const filmObj = { label: filmTitle, children: [] }
          this.dataTree.push(filmObj)
        }) */
        filmsTitles.forEach((filmTitle) => {
          const typeEntities = [] // список уникальных типов сущностей
          entytiesDatas.forEach((entData) => {
            // добаваляем уникальные типы сущностей
            if (filmTitle === entData.filmEnt && !typeEntities.includes(entData.typeEnt)) {
              typeEntities.forEach((typeEnt) => {
                // if ()
              })
              typeEntities.push({ label: entData.typeEnt, children})
            }
          })
          console.log('typeEntities', typeEntities)
          
          const filmObj = { label: filmTitle, children: typeEntities }
          this.dataTree.push(filmObj)
        })

        // this.dataTree = this.dataT
      } catch (err) {
        console.error(err)
      }
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
.label {
  color: #fff;
  font-size: 1em;
  margin-bottom: 0.5em;
}
</style>
