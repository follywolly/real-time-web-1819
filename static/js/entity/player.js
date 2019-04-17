import Entity from './index.js'
import tile from '../map/tile.js'
import store from '../store/index.js'
import grid from '../map/grid.js'

class Player extends Entity {
  constructor(props) {
    const el = document.createElement('div')
    super({...props, el, speed: 150})

    store.subscribe('clickedTile', this.onMove.bind(this), 'player')
  }
  async build(user, socket) {
    this.name = user.username
    this.coords = user.coords
    this.socket = socket
    this.el.classList.add('player')
    const span = document.createElement('span')
    span.innerText = this.name
    this.el.appendChild(span)
    document.querySelector('#map').appendChild(this.el)
    this.setStyle({
      width: `${tile.size}px`,
      height: `${tile.size}px`,
      top: '0',
      left: '0',
      'transition-duration': '0s',
      transform: `translate(${this.coords[1] * tile.size}px, ${this.coords[0] * tile.size}px)`
    })
  }
  onMove(clicked) {
    const coords = this.formatCoords(clicked)
    this.socket.emit('move', this.name, coords)
    this.move(coords)
    this.coords = coords
  }
}

const player = new Player()

export default player
