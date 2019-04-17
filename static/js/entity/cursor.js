// import Entity from './index.js'

class Cursor  {
  constructor(props) {
    this.styles = []
    this.el = document.querySelector('#cursor')
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
}

const cursor = new Cursor()

export default cursor
