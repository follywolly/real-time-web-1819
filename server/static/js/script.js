import store from './store/index.js'
import signup from './user/signup.js'
import message from './user/message.js'
import User from './user/user.js'

const socket = io()
socket.on('connect', () => {
  store.setState({userID: socket.io.engine.id})
})

// gameHandler
signup.init(socket)
message.init(socket)


socket.on('userConnect', user => {
  console.log('user connected', user);
  if (user.id === store.getState('userID')) {
    return
  }
  const users = store.getState('users')
  users.push(new User(user, socket))
  store.setState(users)
})
socket.on('userDisconnect', id => {
  console.log('user disconnected', id);
  const temp = store.getState('users')
  const index = temp.findIndex(obj => obj.id === id)
  if (index) {
    const users = temp.splice(index, 1)
    const el = document.querySelector(`[data-playerID="${id}"]`)
    if (el) {
      el.remove()
    }
    store.setState(users)
  }

})
socket.on('move', user => {
  if (user.id === store.getState('userID')) {
    return
  }
  const users = store.getState('users')
  const i = users.findIndex(obj => obj.id === user.id)
  if (i > -1) {
    console.log(user.coords)
    users[i].setMove(user.coords.x, user.coords.y)
  }
})
