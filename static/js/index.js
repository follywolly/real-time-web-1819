import store from './store/index.js'
import player from './entity/player.js'
import User from './entity/user.js'
import map from './map/index.js'

const socket = io()

socket.on('connect', () => {
  store.setState({socketID: socket.io.engine.id})
})

const form = document.querySelector('#login')

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault()

    const user = {}
    const inputs = form.querySelectorAll('input:not([type="submit"])')
    inputs.forEach(input => {
      user[input.name] = input.value
    })
    socket.emit('login', user, login)
  })
}

function login(user) {
  if (user.error) {
    return document.querySelector('#feedback').innerText = user.error
  }
  console.log('own: ', user);
  socket.emit('getUsers', users => {
    users = users.filter(acc => acc.username !== user.username)

    users = users.map(acc => {
      const gen = new User(acc)
      gen.build()
      return gen
    })
    store.setState({users})
    store.setState({user})
    map.init()
      .then(async () => {
        if (!user.coords) {
          user.coords = await player.genRandomCoords()
        }
        player.build(user, socket)
        socket.emit('userConnect', user)
        form.parentNode.classList.remove('show')
      })
  })
  socket.on('userConnect', acc => {
    if (acc.username === user.username) return
    const gen = new User(acc)
    gen.build()
    const users = store.getState('users')
    users.push(gen)
    store.setState({users})
  })
  socket.on('move', (id, coords) => {
    const users = store.getState('users')
    const index = users.findIndex(player => player.socket === id)
    if (index > -1) {
      users[index].onMove(coords)
    }

  })

}
