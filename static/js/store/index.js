class Store {
  constructor() {
    this.state = {
      socketID: null,
      user: null,
      users: [],
      clickedTile: null,
      currentMap: 'london'
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

export default store
