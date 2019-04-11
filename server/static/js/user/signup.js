import store from '../store/index.js'
import Player from './player.js'

const signup = {
  init(socket) {
    const userForm = document.querySelector('#user-form')
    if (userForm) {
      const name = document.querySelector('#user-input')
      const color = document.querySelector('#user-color')

      userForm.addEventListener('submit', e => {
        e.preventDefault()
        userForm.classList.add('hide')
        document.querySelector('#chat').focus()

        const options = {
          name: name.value,
          id: store.getState('userID'),
          color: color.value
        }
        const client = new Player(options, socket)
        store.setState({client})
        socket.emit('userConnect', options)
      })
    }


  }
}

export default signup
