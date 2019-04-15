import astar from '../pathfinder/index.js'
import grid from '../map/grid.js'
import store from '../store/index.js'
import tile from '../map/tile.js'

class Entity {
  constructor(props) {
    this.styles = []
    this.el = props.el
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

    this.step(route)
  }
  step(route, i = 0) {
    console.log(route, i);
    if (i === route.length) {
      return
    }
    const node = route[i]
    setTimeout(() => {
      store.setState({currentCoords: [node.x, node.y]})
      this.setStyle({transform: `translate(${node.y * tile.size}px,${node.x * tile.size}px)`})
      this.step(route, i + 1)
    }, 150)
  }
}

export default Entity
