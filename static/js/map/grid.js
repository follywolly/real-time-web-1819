import tile from './tile.js'
import astar from '../pathfinder/index.js'

const grid = {
  init(el) {
    this.map = el
    this.tile = tile
  },
  generate(x, y) {
    const rows = []
    const astarRows = []
    for (let i = 0; i < y; i++) {
      let tiles = []
      let astarColumns = []
      for (let j = 0; j < x; j++) {
        const el = document.createElement('div')
        el.classList.add('tile')
        el.setAttribute('data-tile', `${i},${j}`)
        this.map.appendChild(el)
        tiles.push({tileID: j, el})
        astarColumns.push(1)
      }
      rows.push({row: i, tiles})
      astarRows.push(astarColumns)
    }
    tile.listeners(this.map)
    this.graph = this.generateAstar(astarRows)
    return rows
  },
  generateAstar(rows) {
    const graph = new astar.Graph(rows)
    return graph
  }
}

export default grid
