const client = require('../server')
require('dotenv').config()

module.exports = {
  checkCache: async (query) => {
    let translateText = await client.client.get(query)
    if (translateText) {
      // client.client.expire(query, 60 * 60 * 24)
      return translateText
    } else {
      return false
    }
  },
  setcache: async (query, translateText) => {
    translateText = JSON.stringify(translateText)
    await client.client.set(query, translateText)
    // await client.client.expire(query, 60 * 60 * 24)
    let json = await client.client.get(query)
    json = await JSON.parse(json)
    return json
  },
}
