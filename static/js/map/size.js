let width, height
import tile from './tile.js'

const size = {
  screen() {
    const w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = w.innerWidth || e.clientWidth || g.clientWidth,
    height = w.innerHeight|| e.clientHeight|| g.clientHeight

    return {width, height}
  },
  calc() {
    // const canvas = this.screen()
    // this.tileGrid = {x: Math.floor(canvas.width / tile.size), y: Math.floor(canvas.height / tile.size)}
    // if (this.tileGrid.x > 30) {
    //   this.tileGrid.x = 30
    // }
    // if (this.tileGrid.y > 20) {
    //   this.tileGrid.y = 20
    // }
    this.tileGrid = {x: 30, y: 20}
    return {width: this.tileGrid.x * tile.size, height: this.tileGrid.y * tile.size, ...this.tileGrid, tile}
  }
}

export default size
