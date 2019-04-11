class Store {
  constructor() {
    this.state = {
      userID: null,
      client: null,
      users: []
    }
  }
  setState(payload) {
    this.state = {...this.state, ...payload}
  }
  getState(property) {
    return this.state[property]
  }
}

const store = new Store()

export default store
