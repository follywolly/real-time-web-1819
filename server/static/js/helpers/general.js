const helper = {
  formatTime(timestamp) {
    let hours = timestamp.getHours()
    hours = hours < 10 ? `0${hours}` : hours
    let minutes = timestamp.getMinutes()
    minutes = minutes < 10 ? `0${minutes}` : minutes
    let seconds = timestamp.getSeconds()
    seconds = seconds < 10 ? `0${seconds}` : seconds
    return `${hours}:${minutes}:${seconds}`
  },
  getRandomColor() {
    const s = '0123456789ABCDEF'
    let c = '#'
    for (var i = 0; i < 6; i++) {
      c += s[(Math.floor(Math.random() * 16))]
    }
    return c
  },
  isNegativeNum(num) {
    return num < 0
  },
  checkOnScreen(container, position, dir, part) {
    const rect = container.getBoundingClientRect()
    const top = position.top - rect.top // must be positive
    const bottom = position.bottom - rect.bottom // must be negative
    const left = position.left - rect.left // must be positive
    const right = position.right - rect.right // must be negative

    // check momentum
    if (dir === 'left') {
      return !this.isNegativeNum(left - part.x)
    }
    if (dir === 'right') {
      return this.isNegativeNum(right + part.x)
    }
    if (dir === 'up') {
      return !this.isNegativeNum(top - part.y)
    }
    if (dir === 'down') {
      return this.isNegativeNum(bottom + part.y)
    }
  }
}
export default helper
