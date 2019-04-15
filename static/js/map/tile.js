import cursor from '../entity/cursor.js'
import grid from './grid.js'
import store from '../store/index.js'

const tile = {
  size: 32,
  listeners() {
    const tiles = document.querySelectorAll('#map .tile')
    tiles.forEach(tile => {
      tile.addEventListener('mouseover', this.moveCursor)
      tile.addEventListener('mousedown', this.setClickedTile)
    })
  },
  moveCursor(e) {
    const bounds = e.target.getBoundingClientRect()
    const mapBounds = document.querySelector('#map').getBoundingClientRect()

    cursor.setStyle({top: `${bounds.top - mapBounds.top}px`, left: `${bounds.left - mapBounds.left}px`})
  },
  setClickedTile(e) {
    store.setState({clickedTile: e.target})
  }
}

export default tile
