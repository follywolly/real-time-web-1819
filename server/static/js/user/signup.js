import store from '../store/index.js'
import helper from '../helpers/general.js'
import Player from './player.js'

const signup = {
  init(socket) {
    const userForm = document.querySelector('#user-form')
    if (userForm) {
      const name = document.querySelector('#user-input')
      const color = document.querySelector('#user-color')

      color.value = helper.getRandomColor()

      userForm.addEventListener('submit', e => {
        e.preventDefault()
        userForm.classList.add('hide')
        document.querySelector('#chat').focus()
        if (color.value === '#F9F9F9') {
          color.value = '#000'
        }
        if (color.value.length > 7) {
          color.value = color.value.substring(0,7)
        }
        if (name.value.length > 15) {
          name.value = name.value.substring(0,15)
        }
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
