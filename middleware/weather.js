const fetch = require('node-fetch')
const store = require('./store.js')

const key = process.env.WEATHER_API_KEY

// London: 2643743
// Amsterdam: 2759794
const ids = [2759794, 2643743].join(',')
const url = `https://api.openweathermap.org/data/2.5/group?id=${ids}&units=metric&APPID=${key}`

function compare(newArr, oldArr) {
  if (newArr.length === 0 || oldArr.length === 0) return newArr
  return newArr.filter((p, idx) => Object.keys(p)
    .some(prop => p[prop] !== oldArr[idx][prop])
  )
}

function handleData(io, db, data) {
  return db.collection('weather').get()
    .then(ref => ref.docs.map(doc => doc.data()))
    .then(arr => {
      store.setState({weather: data})
      const updated = compare(data, arr)
      if (updated.length === 0) return
      updated.forEach(update => {
        console.log('updating weather for ', update.name)
        io.to(update.name.toLowerCase()).emit('weather', update)
      })
      updated.map(location => {
        return db.collection('weather')
          .doc(location.name.toLowerCase())
          .set(location)
      })
    })
}

async function pullWeatherData(io, db) {
  console.log('pulling weather data');
  const wait = await fetch(url)
    .then(data => data.json())
    .then(data => data.list.map(obj => ({
      name: obj.name.toLowerCase(),
      temp: obj.main.temp ? obj.main.temp : null,
      clouds: obj.clouds ? obj.clouds : null,
      weather: obj.weather && obj.weather[0] ? obj.weather[0].main.toLowerCase() : null
    })))
    .then(data => handleData(io, db, data))
    .catch(console.log)
  setTimeout(() => pullWeatherData(io, db), 1000 * 60 * 10)
}

module.exports = pullWeatherData
