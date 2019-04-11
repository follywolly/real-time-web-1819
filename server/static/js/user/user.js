import dom from '../helpers/dom.js'
import helper from '../helpers/general.js'

class User {
  constructor(options, socket) {
    this.name = options.name
    this.id = options.id
    this.color = options.color
    this.socket = socket
    this.styles = []
    if (options.position) {
      this.position = options.position
    } else {
      this.position = {
        x: 0,
        y: 0
      }
    }
    this.momentum = 5

    this.map = document.querySelector('#map')

    const rect = this.map.getBoundingClientRect()
    this.x = this.genPart(rect.width)
    this.y = this.genPart(rect.height)
    console.log(this.x, this.y);
    this.canMove = true


    this.render()
  }
  render() {
    this.player = dom.appendElTo(this.map, 'div', {class: 'player'})
    dom.appendElTo(this.player, 'span', {class: 'player__name', text: this.name})
    dom.appendElTo(this.player, 'ul', {class: 'player__messages'})
    this.player.dataset.player = this.id
    this.setStyle({name: 'background-color', value: this.color})
    this.setStyle({name: 'transform', value: `translate(${this.position.x * this.x}px, ${this.position.y * this.y}px)`})
  }
  genPart(space) {
    return space / 100 * this.momentum
  }
  setMove(dir) {
    const allowed = helper.checkOnScreen(this.map, this.player.getBoundingClientRect(), dir, {x: this.x, y: this.y})

    if (!allowed) return
    this.canMove = !this.canMove

    if (dir === 'left') {
      this.position.x--
    }
    if (dir === 'right') {
      this.position.x++
    }
    if (dir === 'up') {
      this.position.y--
    }
    if (dir === 'down') {
      this.position.y++
    }

    this.setStyle({name: 'transform', value: `translate(${this.position.x * this.x}px, ${this.position.y * this.y}px)`})
    setTimeout(() => this.canMove = !this.canMove, 300)
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
