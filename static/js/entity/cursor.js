import Entity from './index.js'

class Cursor extends Entity {
  constructor(props) {
    const el = document.querySelector('#cursor')
    super({...props, el})
  }
}

const cursor = new Cursor()

export default cursor
