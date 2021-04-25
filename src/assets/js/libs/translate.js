function translateTypeEntities (type) {
  let res
  switch (type) {
    case 'planets':
      res = 'Планета'
      break
    case 'films':
      res = 'Фильм'
      break
    case 'people':
      res = 'Персонаж'
      break
    case 'species':
      res = 'Тип персонажа'
      break
    case 'starships':
      res = 'Звездолёт'
      break
    case 'vehicles':
      res = 'Транспортное средство'
      break
  }
  return res
}
export default translateTypeEntities
