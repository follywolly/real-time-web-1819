const fetch = require('node-fetch')
const store = require('./store.js')

const key = process.env.CRYPTO_API_KEY

const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,BCH,ETH&tsyms=EUR&api_key=${key}`

function compare(newArr, oldArr) {
  if (newArr.length === 0 || oldArr.length === 0) return newArr
  return newArr.filter((p, idx) => Object.keys(p)
    .some(prop => p[prop] !== oldArr[idx][prop])
  )
}
function round(num, pre = 0) {
  const pow = Math.pow(10, pre)
  return Math.round(num * pow) / pow
}

function handleData(io, db, data) {
  return db.collection('crypto').get()
    .then(ref => ref.docs.map(doc => doc.data()))
    .then(arr => {
      store.setState('crypto', data)
      const updated = compare(data, arr)
      if (updated.length === 0) return
      updated.forEach(update => {
        console.log('updating price for ', update.name);
        io.emit('crypto', update)
      })
      updated.map(coin => {
        return db.collection('crypto')
        .doc(coin.name.toLowerCase())
        .set(coin)
      })
    })
}

async function pullCryptoData(io, db) {
  console.log('pulling crypto data off');
  // console.log('pulling crypto data');
  // const wait = await fetch(url)
  //   .then(data => data.json())
  //   .then(data => Object.entries(data).map(entry => ({name: entry[0], price: round(Number(entry[1].EUR) / 10) * 10})))
  //   .then(data => handleData(io, db, data))
  //   .catch(console.log)
  // setTimeout(() => pullCryptoData(io, db), 1000 * 60)
}

module.exports = pullCryptoData
