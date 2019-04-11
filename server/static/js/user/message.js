import store from '../store/index.js'
import dom from '../helpers/dom.js'

const message = {
  init(socket) {
    const form = document.querySelector('#chat-form')

    if (form) {
      const input = document.querySelector('#chat')
      form.addEventListener('submit', e => {
        e.preventDefault()
        const user = store.getState('client')

        socket.emit('message', {user: user.name, id: user.id, val: input.value})
        input.value = ''
        document.querySelector('#map').focus()
        input.blur()
      })
    }

    socket.on('message', msg => {
      const messageNodes = document.querySelectorAll('.message')
      const id = store.getState('userID')

      let nodeClass = ['message']
      if (messageNodes && messageNodes.length > 0) {
        const lastUser = messageNodes[messageNodes.length - 1].dataset.user
        console.log(lastUser, msg.id);
        if (lastUser === msg.id) {
          nodeClass.push('same-user')
        }
      }
      if (msg.id === id) {
        nodeClass.push('client')
      }
      const container = document.querySelector(`[data-player="${msg.id}"] .player__messages`)
      const length = container.childNodes.length
      const offset = 50 * length;
      const li = dom.appendElTo(container, 'li', {class: nodeClass})
      container.style = `transform: translateY(-${offset});`

      li.dataset.user = msg.id
      dom.appendElTo(li, 'span', {text: msg.val, class: 'end'})
      setTimeout(() => {
        li.remove()
        const length = container.childNodes.length
        const offset = 50 * length;
        container.style = `transform: translateY(-${offset});`
      }, 5000)
    })
  }
}

export default message
