const bcrypt = require('bcrypt')

const auth = {
  login(username, pass, db) {
    return new Promise(async (resolve, reject) => {
      const doc = await db.collection('users').doc(username.toLowerCase()).get()
      if (!doc.exists) {
        reject('User doesn\'t exist')
      }
      const user = doc.data()
      const match = await bcrypt.compare(pass, user.password)
      if (match) {
        delete user.password
        resolve(user)
      } else {
        reject('Password is incorrect')
      }
    })
  },
  register(name, pass, db) {
    const username = name.toLowerCase()
    return new Promise(async (resolve, reject) => {
      const doc = await db.collection('users').doc(username).get()
      if (doc.exists) {
        reject('User already exists')
      }
      const hash = await bcrypt.hash(pass, 10)
      db.collection('users').doc(username).set({username, password: hash})
      resolve({username})
    })
  }
}


module.exports = auth
