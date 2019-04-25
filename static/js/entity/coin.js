import Entity from './index.js'
import tile from '../map/tile.js'
import store from '../store/index.js'

class Coin extends Entity {
  constructor(props) {
    const el = document.createElement('div')
    super({...props, el, speed: 0})
    this.name = props.name
    this.price = props.price
    this.room = props.room
    this.coords = props.coords
    this.generate()
  }
  generate() {
    this.el.classList.add('coin')

    const span = document.createElement('span')
    span.innerText = `${this.name}: ${this.price} points`
    this.el.appendChild(span)
    this.map.appendChild(this.el)
    this.setStyle({
      width: `${tile.size / 2}px`,
      height: `${tile.size / 2}px`,
      top: `${tile.size / 4}px`,
      left: `${tile.size / 4}px`,
      'transition-duration': '0s',
      transform: `translate(${this.coords[1] * tile.size}px, ${this.coords[0] * tile.size}px)`
    })
    this.el.dataset.tile = this.coords
    this.el.addEventListener('click', e => {
      store.setState({clickedTile: e.target})
    })
    setTimeout(() => {
      if (this.el.parentNode) {
        this.el.parentNode.removeChild(this.el)
      }
    }, 4000)
  }
  delete() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el)
    }
  }
}

export default Coin
