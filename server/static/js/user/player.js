import dom from '../helpers/dom.js'
import User from './user.js'

class Player extends User {
  constructor(options, socket) {
    super(options, socket)
    this.player.setAttribute('id', 'client-user')
    this.keyCodes = [37, 38, 39, 40]
    this.chatKey = 13
    window.addEventListener('keydown', e => {
      this.move(e)
    })
    this.momentum = 20

  }
  move(e) {
    if (e.keyCode === this.chatKey) {
      const input = document.querySelector('#chat')
      input.focus()
    }
    // 37, 38, 39, 40
    if (!this.keyCodes.includes(e.keyCode)) return
    let coords
    if (e.keyCode === 37) {
      coords = {x: -this.momentum, y: 0}
    }
    if (e.keyCode === 38) {
      coords = {x: 0, y: -this.momentum}
    }
    if (e.keyCode === 39) {
      coords = {x: this.momentum, y: 0}
    }
    if (e.keyCode === 40) {
      coords = {x: 0, y: this.momentum}
    }
    this.setMove(coords.x, coords.y)
    this.socket.emit('move', {id: this.id, coords})
  }
}

export default Player
