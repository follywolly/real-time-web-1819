import store from './store/index.js'
import player from './entity/player.js'
import User from './entity/user.js'
import Bomb from './entity/bomb.js'
import map from './map/index.js'
import scoreboard from './map/scoreboard.js'
import socket from './connection/index.js'

socket.on('connect', () => {
  store.setState({socketID: socket.io.engine.id})
})

const form = document.querySelector('#login')
const feedback = document.querySelector('#feedback')

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()

    const user = {}
    const inputs = form.querySelectorAll('input:not([type="submit"])')
    inputs.forEach(input => {
      user[input.name] = input.value
    })
    user.room = form.querySelector('#room').value
    socket.emit('login', user, login)
  })
}

function login(user) {
  if (user.error) {
    return feedback.innerText = user.error
  }
  console.log('own: ', user);
  socket.emit('getUsers', user.room, (data, scores, weather) => {
    console.log('initial weather: ', weather);
    if (data.error) {
      return feedback.innerText = data.error
    }
    const users = data
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
        socket.emit('userConnect', user)
        form.parentNode.classList.remove('show')
      })
      .catch(err => {
        feedback.innerText = err
      })
  })
  socket.on('userConnect', acc => {
    console.log('connected to ', acc.room, acc.username)
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
      console.log('disconnecting in ', player.room, player.name)
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
  socket.on('weather', weather => {
    console.log('weatherupdate: ', weather);
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
    console.log(scores);
    store.setState({scores})
  })
}
