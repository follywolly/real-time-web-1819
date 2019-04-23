import Entity from './index.js'
import tile from '../map/tile.js'
import store from '../store/index.js'
import grid from '../map/grid.js'

class Bomb extends Entity {
  constructor(props) {
    const el = document.createElement('div')
    super({...props, el, speed: 0})

    this.player = props.player
    this.coords = props.coords
    this.generate()
  }
  generate() {
    this.el.classList.add('bomb')
    this.map.appendChild(this.el)
    this.setStyle({
      width: `${tile.size / 2}px`,
      height: `${tile.size / 2}px`,
      top: `${tile.size / 4}px`,
      left: `${tile.size / 4}px`,
      'transition-duration': '0.3s',
      transform: `translate(${this.coords[1] * tile.size}px, ${this.coords[0] * tile.size}px)`
    })
    setTimeout(() => {
      console.log('BOOM');
      this.setStyle({
        width: `${tile.size * 3.5}px`,
        height: `${tile.size * 3.5}px`,
        opacity: '0',
        'transition-duration': '0.3s',
        transform: `translate(${this.coords[1] * tile.size - tile.size * 1.5}px, ${this.coords[0] * tile.size - tile.size * 1.5}px)`
      })
      setTimeout(() => {
        this.el.parentNode.removeChild(this.el)
      }, 300)
    }, 2000)
  }
}

export default Bomb
