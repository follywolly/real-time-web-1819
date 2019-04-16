import Entity from './index.js'
import tile from '../map/tile.js'
import store from '../store/index.js'

class Player extends Entity {
  constructor(props) {
    const el = document.createElement('div')
    el.classList.add('player')
    document.querySelector('#map').appendChild(el)
    super({...props, el})

    this.setStyle({width: `${tile.size}px`, height: `${tile.size}px`, top: '0', left: '0'})
    store.subscribe('clickedTile', this.onMove.bind(this), 'player')
  }
  onMove(current) {
    const coords = this.genCoords(current)
    this.move(coords)
  }
}

const player = new Player()

export default player
