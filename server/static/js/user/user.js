import dom from '../helpers/dom.js'

class User {
  constructor(options, socket) {
    this.name = options.name
    this.id = options.id
    this.color = options.color
    this.socket = socket
    this.styles = []
    this.moveCoords = {
      x: 0,
      y: 0
    }

    this.map = document.querySelector('#map')

    this.render()
  }
  render() {
    this.player = dom.appendElTo(this.map, 'div', {class: 'player'})
    dom.appendElTo(this.player, 'span', {class: 'player__name', text: this.name})
    dom.appendElTo(this.player, 'ul', {class: 'player__messages'})
    this.player.dataset.player = this.id
    this.setStyle({name: 'background-color', value: this.color})
  }
  setMove(x, y) {
    console.log(x, y, this.name);
    this.moveCoords.x += x
    this.moveCoords.y += y
    this.setStyle({name: 'transform', value: `translate(${this.moveCoords.x}px, ${this.moveCoords.y}px)`})
  }
  setStyle(styleObj) {
    const temp = []
    const existingIndex = this.styles.findIndex(style => style.name === styleObj.name)

    // check if style exists on element already and acts accordingly
    if (existingIndex < 0) {
      this.styles.push(styleObj)
    } else {
      this.styles[existingIndex].value = styleObj.value
    }

    this.styles.forEach(style => {
      temp.push(`${style.name}:${style.value};`)
    })
    const styles = temp.join('')
    this.player.style = styles
  }
  removeStyle(name) {
    const index = this.styles.findIndex(style => style.name === name)
    if (index > -1) {
      this.styles.splice(index, 1)
    }
  }
}

export default User
