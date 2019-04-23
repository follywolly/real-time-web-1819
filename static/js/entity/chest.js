import Entity from './index.js'
import tile from '../map/tile.js'
import store from '../store/index.js'
import grid from '../map/grid.js'

class Chest extends Entity {
  constructor(props) {
    const el = document.createElement('div')
    super({...props, el, speed: 0})
  }
  generate() {
    this.value = 30
    this.el.classList.add('chest')
    const span = document.createElement('span')
    span.innerText = 'chest'
    this.el.appendChild(span)
    this.map.appendChild(this.el)

    this.genRandomCoords()
      .then(coords => {
        store.setState({currentCoords: coords})

        console.log(coords);

        this.setStyle({
          width: `${tile.size}px`,
          height: `${tile.size}px`,
          top: '0',
          left: '0',
          'transition-duration': '0s',
          transform: `translate(${coords[1] * tile.size}px, ${coords[0] * tile.size}px)`
        })
      })
  }
}

export default Chest
