import axios from 'axios'

const SWAPI_PATH = 'https://swapi.dev/api'

// сущность
class BackendApi {
  // получение видов сущностей
  static async getTypesEntities () {
    const types = []
    try {
      const resp = await axios.get(`${SWAPI_PATH}/`)
      for (const key in resp.data) {
        types.push(key)
      }
    } catch (err) {
      console.error(err)
    }
    return types
  }

  // получение сущностей по их типу
  static async getEntities (type) {
    const entities = []
    const types = await BackendApi.getTypesEntities()
    if (types.includes(type)) {
      try {
        let resp = await axios.get(`${SWAPI_PATH}/${type}/`)
        resp.data.results.forEach((el) => {
          entities.push(el)
        })
        const pageCount = Math.ceil(resp.data.count / 10)
        for (let page = 2; page <= pageCount; page++) {
          resp = await axios.get(`${SWAPI_PATH}/${type}/?page=${page}`)
          resp.data.results.forEach((el) => {
            entities.push(el)
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
    return entities
  }

  static async getPeopleByID (id) {
    const people = null
    try {
      const resp = await axios.get(`${SWAPI_PATH}/people/${id}`)
      /* if (resp && resp.data && resp.data.results) {
        people = resp.data.results
      } */
      console.log(resp)
    } catch (err) {
      console.log(err)
    }
    return people
  }

  static async getPeople () {
    let people = null
    people = await BackendApi.getEntities('people')
    return people
  }

  static async getFilms () {
    let films = null
    films = await BackendApi.getEntities('films')
    return films
  }

  static async getPlanets () {
    let planets = null
    planets = await BackendApi.getEntities('planets')
    return planets
  }

  static async getSpecies () {
    let species = null
    species = await BackendApi.getEntities('species')
    return species
  }

  static async getStarships () {
    let starships = null
    starships = await BackendApi.getEntities('starships')
    return starships
  }

  static async getVehicles () {
    let vehicles = null
    vehicles = await BackendApi.getEntities('vehicles')
    return vehicles
  }
}

export default BackendApi
