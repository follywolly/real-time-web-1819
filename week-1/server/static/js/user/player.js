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

  }
  move(e) {
    if (e.keyCode === this.chatKey) {
      const input = document.querySelector('#chat')
      input.focus()
    }
    // 37, 38, 39, 40
    if (!this.keyCodes.includes(e.keyCode)) return

    let dir
    if (e.keyCode === 37) {
      dir = 'left'
    }
    if (e.keyCode === 38) {
      dir = 'up'
    }
    if (e.keyCode === 39) {
      dir = 'right'
    }
    if (e.keyCode === 40) {
      dir = 'down'
    }
    if (!this.canMove) return
    this.setMove(dir)
    this.socket.emit('move', {id: this.id, dir, position: this.position})
  }
}

export default Player
