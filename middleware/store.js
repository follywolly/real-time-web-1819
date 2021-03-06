class Store {
  constructor() {
    this.state = {
      users: [],
      scores: [],
      coins: [],
      rooms: [],
      crypto: [],
      weather: []
    }
    this.subscriptions = []
  }
  setState(payload) {
    const entries = Object.entries(payload)
    entries.forEach(entry => {
      const prop = entry[0]
      const val = entry[1]
      const subscriptions = this.subscriptions.filter(sub =>  sub.prop === prop)
      subscriptions.forEach(sub => sub.cb(val))
    })
    this.state = {...this.state, ...payload}
  }
  pushState(property, value) {
    if (Array.isArray(this.state[property])){
      return this.state[property].push(value)
    }
  }
  removeIndex(property, index) {
    this.state[property].splice(index, 1)
  }
  getState(property) {
    return this.state[property]
  }
  subscribe(prop, cb, id) {
    const index = this.subscriptions.findIndex(sub => sub.id === id && sub.prop === prop)
    if (index > -1) {
      const existing = this.subscriptions[index]
      if (existing.cb.toString() !== cb.toString()) {
        this.subscriptions[index] = {id, prop, cb}
      }
    } else {
      this.subscriptions.push({id, prop, cb})
    }
  }
}

const store = new Store()

module.exports = store
