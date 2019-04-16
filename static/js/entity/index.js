import astar from '../pathfinder/index.js'
import grid from '../map/grid.js'
import store from '../store/index.js'
import tile from '../map/tile.js'

class Entity {
  constructor(props) {
    this.styles = []
    this.el = props.el
    this.queue = []
    this.break = false
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
  genCoords(el) {
    return el.dataset.tile.split(',').map(val => Number(val))
  }
  move(c) {
    const s = store.getState('currentCoords')
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
    },200)
  }
  step(length) {
    if (length === 0 || this.break) {
      return
    }
    const node = this.queue[0]
    this.queue.shift()
    setTimeout(() => {
      store.setState({currentCoords: [node.x, node.y]})
      this.setStyle({transform: `translate(${node.y * tile.size}px,${node.x * tile.size}px)`})
      this.step(this.queue.length)
    }, 150)
  }
}

export default Entity
