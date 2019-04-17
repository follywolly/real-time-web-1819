import astar from '../pathfinder/index.js'
import grid from '../map/grid.js'
import store from '../store/index.js'
import tile from '../map/tile.js'
import helper from '../helpers/index.js'

class Entity {
  constructor(props) {
    this.styles = []
    this.el = props.el
    this.speed = props.speed
    this.queue = []
    this.break = false
    this.map = document.querySelector('#map')
  }
  setStyle(obj) {
    const styles = Object.entries(obj)
    styles.forEach(style => {
      const index = this.styles.findIndex(obj => obj[0] === style[0])
      if (index > -1) {
        // exists
        this.styles[index] = style
      } else {
       this.styles.push(style)
      }
    })
    this.el.style = this.styles
      .map(style => style.join(':'))
      .join(';')

  }
  getStyles() {
    return this.styles
  }
  formatCoords(el) {
    return el.dataset.tile.split(',').map(val => Number(val))
  }
  move(c) { // coords
    const s = this.coords
    const start = grid.graph.grid[s[0]][s[1]]
    const end = grid.graph.grid[c[0]][c[1]]
    const route = astar
      .search(grid.graph, start, end)
      .map(node => ({x: node.x, y: node.y}))
    this.addToQueue(route)
  }
  addToQueue(value) {
    const length = this.queue.length
    if (length > 0) {
      this.queue = []
    }
    if (Array.isArray(value)) {
      this.queue = this.queue.concat(value)
    } else {
      this.queue.push(value)
    }
    this.break = true
    setTimeout(()=>{
      this.break = false
      this.step(this.queue.length)
    }, this.speed)
  }
  step(length) {
    if (length === 0 || this.break) {
      return
    }
    const node = this.queue[0]
    this.queue.shift()
    setTimeout(() => {
      this.setStyle({transform: `translate(${node.y * tile.size}px,${node.x * tile.size}px)`, 'transition-duration': `${this.speed / 1000}s`})
      this.step(this.queue.length)
    }, this.speed)
  }
  setLocation(coords) {
    this.setStyle({transform: `translate(${coords[1] * tile.size}px,${coords[0] * tile.size}px)`, 'transition-duration': `0s`})
  }
  genRandomCoords() {
    const promises = []
    promises.push(getWalkable())

    function getWalkable() {
      return new Promise((resolve, reject) => {
        const coords = []
        const rows = grid.model.length
        const columns = grid.model[0].length
        const row = helper.getRandomInt(rows)
        const column = helper.getRandomInt(columns)
        if (grid.model[row][column] > 0 ) {
          return resolve([row, column])
        }
        promises.push(getWalkable())
      })
    }
    return Promise.race(promises)
  }
  spawnRandom() {
    this.genRandomCoords()
      .then(coords => this.setLocation(coords))
  }
}

export default Entity
