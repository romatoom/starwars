import BackendApi from '../../assets/js/libs/BackendApi'

export default {
  state: {
    entities: [],
    favoritesURLs: []
  },
  getters: {
    allEntities (state) {
      return state.entities
    },
    allFavoritesURLs (state) {
      return state.favoritesURLs
    },
    allFavorites (state) {
      const favorites = []
      state.favoritesURLs.forEach((favURL) => {
        const findElem = state.entities.find((el) => {
          return el.entity.url === favURL
        })
        if (findElem !== undefined) favorites.push(findElem)
      })
      return favorites
    }
  },
  mutations: {
    updateEntities (state, entities) {
      state.entities = entities
    },
    updateFavoritesURLs (state, favoritesURLs) {
      state.favoritesURLs = favoritesURLs
    },
    addFavorite (state, url) {
      const exist = state.favoritesURLs.includes(url)
      if (!exist) {
        state.favoritesURLs.push(url)
        localStorage.setItem('favorites_urls', JSON.stringify(state.favoritesURLs))
      }
    },
    deleteFavorite (state, url) {
      const index = state.favoritesURLs.indexOf(url)
      if (index !== -1) {
        state.favoritesURLs.splice(index, 1)
        localStorage.setItem('favorites_urls', JSON.stringify(state.favoritesURLs))
      }
    }
  },
  actions: {
    async loadAllEntities ({ commit }) {
      // получаем виды сущностей
      const types = await BackendApi.getTypesEntities()
      const entities = []
      let id = 0
      const promises = types.map(async (type) => {
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
          entities.push(entsObj)
        })
      })
      await Promise.all(promises)
      commit('updateEntities', entities)
    },
    loadFavorites ({ commit }) {
      const favoritesURLs = JSON.parse(localStorage.getItem('favorites_urls'))
      if (favoritesURLs !== null) {
        commit('updateFavoritesURLs', favoritesURLs)
      }
    },
    addFavorite ({ commit }, url) {
      commit('addFavorite', url)
    },
    deleteFavorite ({ commit }, url) {
      commit('deleteFavorite', url)
    }
  }
}
