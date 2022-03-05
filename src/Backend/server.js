const express = require('express')
// const fetch = require('node-fetch')
const crypto = require('crypto')
const redis = require('redis')
const axios = require('axios').default
const cache = require('./src/cache')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
const PORT = process.env.PORT || 5000

// Connecting to Redis and Launching Express App
const client = redis.createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URI}:${process.env.REDIS_PORT}`,
})
client.on('error', (err) => console.log('Redis Client Error', err))
client.connect().then(() => console.log('Redis Connected!'))

// Flush DB on startup
client.flushDb()

// Exporting Connected Client
exports.client = client

app.get('/api', (req, res) => {
  let text = req.query.text
  let from = req.query.from
  let to = req.query.to

  // Read Through Cache Strategy
  if (text !== null && from !== null && to !== null) {
    let query = `${from}-${text}-${to}`
    query = query.replace(/\W/g, '')
    query = crypto.createHash('sha1').update(query).digest('hex')
    cache.checkCache(query).then((result) => {
      if (result) {
        res.send(result)
      } else {
        const params = { q: text, source: from, target: to, format: 'text' }
        axios
          .post('https://libretranslate.de/translate', params, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((result) => {
            let translateData = result.data
            translateData['from'] = from
            translateData['to'] = to
            translateData['text'] = text
            cache.setcache(query, translateData).then((translatedTextRedis) => {
              res.send(translatedTextRedis)
            })
          })
      }
    })
  } else {
    res.status(400).send('Bad Request')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
