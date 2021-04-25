<template>
  <el-main>
    <h1>Поиск</h1>
    <el-input class="finder" placeholder="Что ищем?" v-model="findText" clearable></el-input>
    <!-- <el-button type='primary' @click='getFilms'>Films</el-button> -->
    <el-row :gutter="10">
      <el-col v-for="(ent, k) in findedEntities" :key="k"
        :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <Card :ent="ent"/>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import Card from '../components/Card'
import { mapGetters } from 'vuex'

export default {
  name: 'Search',
  components: {
    Card
  },
  data: () => ({
    findText: ''
  }),
  computed: {
    ...mapGetters(['allEntities']),
    findedEntities () {
      return this.allEntities.filter((el) => {
        if (el.type === 'films') {
          return el.entity.title.toUpperCase().indexOf(this.findText.toUpperCase()) === 0
        } else {
          return el.entity.name.toUpperCase().indexOf(this.findText.toUpperCase()) === 0
        }
      })
    }
  }
}
</script>

<style scoped>
.finder {
  margin-bottom: 1em;
}
</style>
