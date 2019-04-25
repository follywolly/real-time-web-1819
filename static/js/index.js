import store from './store/index.js'
import socket from './connection/index.js'
import game from './game/handler.js'

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
  game.init(user)
}
