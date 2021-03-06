import Entity from './index.js'
import tile from '../map/tile.js'
import store from '../store/index.js'
import grid from '../map/grid.js'

class User extends Entity {
  constructor(props) {
    const el = document.createElement('div')
    super({...props, el, speed: 150})

    this.name = props.username
    this.socket = props.socket
    this.coords = props.coords
    this.room = props.room
  }
  build() {
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
  onMove(coords) {
    this.move(coords, false)
    // this.coords = coords
  }
}

export default User
