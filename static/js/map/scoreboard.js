import store from '../store/index.js'

const scoreboard = {
  init(scores) {
    store.subscribe('scores', this.update, 'scoreboard')
    this.update(scores)
  },
  update(scores) {
    const el = document.querySelector('#scoreboard')
    el.innerHTML = ''
    scores = scores.sort((a, b) => b.points - a.points)
    scores.forEach(score => {
      const li = document.createElement('li')
      li.innerText = `${score.player}: ${score.points}`
      el.appendChild(li)
    })
  }
}

export default scoreboard
