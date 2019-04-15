import size from './size.js'
import grid from './grid.js'
import cursor from '../entity/cursor.js'
import player from '../entity/player.js'

const map = {
  el: document.querySelector('#map'),
  init(){
    const bounds = size.calc()
    this.el.style = `width: ${bounds.width}px; height: ${bounds.height}px; grid-template-columns: repeat(${bounds.x}, ${bounds.tile.size}px); grid-template-rows: repeat(${bounds.y}, ${bounds.tile.size}px)`
    cursor.setStyle({width: `${bounds.tile.size}px`, height: `${bounds.tile.size}px`})
    grid.init(this.el)
    grid.generate(bounds.x, bounds.y)
  }
}

export default map
