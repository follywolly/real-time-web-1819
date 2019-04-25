import size from './size.js'
import grid from './grid.js'
import cursor from '../entity/cursor.js'
import player from '../entity/player.js'
import store from '../store/index.js'

const map = {
  el: document.querySelector('#map'),
  init(){
    return new Promise((resolve, reject) => {
      const bounds = size.calc()
      this.el.style = `width: ${bounds.width}px; height: ${bounds.height}px; grid-template-columns: repeat(${bounds.x}, ${bounds.tile.size}px); grid-template-rows: repeat(${bounds.y}, ${bounds.tile.size}px)`
      cursor.setStyle({width: `${bounds.tile.size}px`, height: `${bounds.tile.size}px`})
      const current = store.getState('currentMap')
      this.readGraph(current)
        .then(graph => {
          if (graph) {
            grid.init(this.el)
            grid.generate(bounds.x, bounds.y, graph)
            return resolve()
          }
          reject('Wasn\'t able to generate map graph')
        })
        .catch(() => reject('Couldn\'t make connection to the internet'))
    })
  },
  readGraph(mapname) {
    return fetch(`/images/maps/${mapname}/map.json`)
      .then(data => data.json())
      .then(file => file[file.findIndex(map => map.name.toLowerCase() === mapname.toLowerCase())])
      .then(file => file.graph)
  }
}

export default map
