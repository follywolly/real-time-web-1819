const helper = {
  getRandomInt(length) {
    return Math.floor(Math.random() * length)
  },
  genBombRange(c) {
    const y = [c[0] - 1, c[0], c[0] + 1]
    const x = [c[1] - 1, c[1], c[1] + 1]
    const range = []
    for (let i = 0; i < y.length; i++) {
      for (let j = 0; j < x.length; j++) {
        range.push([y[i], x[j]])
      }
    }
    return range
  }
}
export default helper
