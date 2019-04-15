import store from './store/index.js'
import signup from './user/signup.js'
import message from './user/message.js'
import User from './user/user.js'

const socket = io()
socket.on('connect', () => {
  store.setState({userID: socket.io.engine.id})
  socket.emit('getUsers', users => {
    users.forEach(user => {
      const users = store.getState('users')
      users.push(new User(user, socket))
      store.setState(users)
    })
  })
  socket.emit('getDBUsers', users => {
    console.log(users);
  })
})

// gameHandler
signup.init(socket)
message.init(socket)


socket.on('userConnect', user => {
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
  if (index > -1) {
    const users = temp.splice(index, 1)
    const el = document.querySelector(`[data-player="${id}"]`)
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
    users[i].setMove(user.dir)
  }
})
