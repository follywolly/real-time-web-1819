import tile from './tile.js'
import astar from '../pathfinder/index.js'

const grid = {
  init(el) {
    this.map = el
    this.tile = tile
  },
  generate(x, y, graph) {
    const rows = []
    for (let i = 0; i < y; i++) {
      let tiles = []
      for (let j = 0; j < x; j++) {
        const el = document.createElement('div')
        el.classList.add('tile')
        el.setAttribute('data-tile', `${i},${j}`)
        this.map.appendChild(el)
        tiles.push({tileID: j, el})
      }
      rows.push({row: i, tiles})
    }
    tile.listeners(this.map)
    this.model = graph
    this.graph = this.generateGraph(graph)
    return rows
  },
  generateGraph(rows) {
    const graph = new astar.Graph(rows)
    return graph
  }
}

export default grid
