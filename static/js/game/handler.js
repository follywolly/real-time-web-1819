import store from '../store/index.js'
import player from '../entity/player.js'
import User from '../entity/user.js'
import Bomb from '../entity/bomb.js'
import Coin from '../entity/coin.js'
import map from '../map/index.js'
import weather from '../map/weather.js'
import scoreboard from '../map/scoreboard.js'
import socket from '../connection/index.js'

const form = document.querySelector('#login')
const feedback = document.querySelector('#feedback')

const game = {
  init(user) {
    socket.emit('getUsers', user.room, (online, scores, forecast, crypto) => {
      weather.init(forecast)
      if (online.error) {
        return feedback.innerText = online.error
      }
      const users = online
        .filter(acc => acc.username !== user.username)
        .map(acc => {
          const gen = new User(acc)
          gen.build()
          return gen
        })
      users.push(user)
      store.setState({scores})
      store.setState({users})
      store.setState({user})
      scoreboard.init(scores)
      map.init()
        .then(async () => {
          if (!user.coords) {
            user.coords = await player.genRandomCoords()
          }
          player.build(user)
          this.events(user)
          socket.emit('userConnect', user)
          form.parentNode.classList.remove('show')
        })
        .catch(err => {
          feedback.innerText = err
        })
    })
  },
  events(user) {
    socket.on('userConnect', acc => {
      if (acc.username === user.username) return
      const gen = new User(acc)
      gen.build()
      const users = store.getState('users')
      users.push(gen)
      store.setState({users})
      const scores = store.getState('scores')
      scores.push({player: acc.username, points: 0})
      store.setState({scores})
    })
    socket.on('userDisconnect', id => {

      const users = store.getState('users')
      const index = users.findIndex(player => player.socket === id)
      if (index > -1) {
        const player = users[index]
        const scores = store.getState('scores')
        const i = scores.findIndex(score => score.player === player.name)
        if (i > -1) {
          scores.splice(i, 1)
        }
        player.delete()
        users.splice(index, 1)
        store.setState({scores})
        store.setState({users})
      }

    })
    socket.on('weather', forecast => {
      weather.update(forecast)
    })
    socket.on('crypto', crypto => {
      console.log('crypto update: ', crypto)
    })
    socket.on('coin', coin => {
      const entity = new Coin(coin)
      const coins = store.getState('coins')
      coins.push(entity)
      store.setState({coins})
    })
    socket.on('coin-taken', coin => {
      const coins = store.getState('coins')
      if (coins.length === 0) return
      const index = coins.findIndex(item => {
        return item.coords.toString() === coin.coords.toString() && item.price === coin.price
      })
      if (index > -1) {
        if (!coins[index]) return
        coins[index].delete()
        coins.splice(index, 1)
        store.setState({coins})
      }

    })
    socket.on('move', (id, coords) => {
      const users = store.getState('users')
      const index = users.findIndex(player => player.socket === id)
      if (index > -1) {
        if (users[index].username === user.username) return
        users[index].onMove(coords)
      }

    })
    socket.on('bomb', bomb => {
      const entity = new Bomb(bomb)
    })
    socket.on('hit', scores => {
      store.setState({scores})
    })
  }
}

export default game
