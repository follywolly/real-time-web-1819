const store = require('./store.js')
const fs = require('fs')
const path = require('path')

function getCrypto(db) {
  return db.collection('crypto').get()
    .then(ref => ref.docs.map(doc => doc.data()))
}
function getRandomInt(length) {
  return Math.floor(Math.random() * length)
}
function genRandomCoords(graph) {
  const promises = []
  promises.push(getWalkable())

  function getWalkable() {
    return new Promise((resolve, reject) => {
      const coords = []
      const rows = graph.length
      const columns = graph[0].length
      const row = getRandomInt(rows)
      const column = getRandomInt(columns)
      if (graph[row][column] > 0 ) {
        return resolve([row, column])
      }
      promises.push(getWalkable())
    })
  }
  return Promise.race(promises)
}
function generateCoinInstances(coin, room) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, `../static/images/maps/${room.name}/map.json`), async (err, data) => {
      if (err) return reject(err)
      const map = JSON.parse(data)
      genRandomCoords(map[0].graph)
        .then(coords => resolve({...coin, room: room.name, taken: false, coords}))
        .catch(reject)
    })
  })
}

function spawnCoin(coin, io) {
  const rooms = store.getState('rooms')
  const promises = []
  rooms.forEach(room => promises.push(generateCoinInstances(coin, room)))
  Promise.all(promises)
    .then(coinInstances => {
      const length = store.pushState('coins', coinInstances)
      rooms.forEach((room, i) => {
        io.to(room.name).emit('coin', coinInstances[i])
      })
      setTimeout(()=> {
        store.removeIndex('coins', length - 1)
      }, 4000)
    })
    .catch(console.log)
}

function genWeightArray(crypto) {
  const result = []
  const weights = [1, 6, 10]
  crypto.forEach((coin, index) => {
    for (let i = 0; i < weights[index]; i++) {
      result.push(coin)
    }
  })
  return result
}

function pickRandomCoin(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}

let getNew = true

setInterval(() => {
  getNew = true
}, 5 * 60 * 1000)

async function startCoinSpawning(io, db) {
  let crypto
  if (getNew) {
    crypto = await getCrypto(db)
    crypto = crypto.sort((a,b) => b.price - a.price)
    store.setState({crypto})
    rooms = await db.collection('rooms').get()
      .then(data => data.docs.map(doc => doc.data()))
    store.setState({rooms})
    getNew = false
  } else {
    crypto = store.getState('crypto')
  }
  const weight = genWeightArray(crypto)
  const random = pickRandomCoin(weight)
  spawnCoin(random, io, db)

  setTimeout(() => {
    startCoinSpawning(io, db)
  }, 5 * 1000)
}



module.exports = startCoinSpawning
