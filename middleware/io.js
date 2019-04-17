const auth = require('./authentication.js')

const handleExports = (socket, io, db) => {
  socket.on('login', (user, cb) => {
    const name = user.name
    const pass = user.pass
    if (name && pass) {
      auth.login(name, pass, db)
        .then(async acc => {
          if (acc.online) {
            return cb({error: 'This account is already logged in'})
          }
          const update = await db.collection('users').doc(acc.username).set({online: true, socket: socket.id}, {merge: true})
          cb({...acc, online: true, socket: socket.id})
        })
        .catch(err => cb({error: err}))
    } else {
      cb({error: 'No username or pass filled in'})
    }
  })
  socket.on('register', (user, cb) => {
    const name = user.name
    const pass = user.pass
    const repeat = user.repeat
    if (pass !== repeat) {
      return cb({error: 'The passwords you filled in did not match'})
    }
    if (name && pass && repeat) {
      auth.register(name, pass, db)
        .then(user => cb(user))
        .catch(err => cb({error: err}))
    } else {
      cb({error: 'Please fill in all fields'})
    }
  })
  socket.on('getUsers', async cb => {
    const data = await db.collection('users').get()
    const users = data.docs
      .filter(doc => doc.data().online)
      .map(doc => ({
          username: doc.data().username,
          socket: doc.data().socket,
          coords: doc.data().coords
        })
      )
    cb(users)
  })
  socket.on('userConnect', user => {
    io.emit('userConnect', user)
  })
  socket.on('disconnect', async () => {
    const data = await db.collection('users').get()
    const doc = data.docs
      .find(doc => doc.data().socket === socket.id)
    const user = doc.data()

    if (!user) return

    db.collection('users')
      .doc(user.username)
      .set({online: false, socket: null},{merge: true})
      .then(() => {
        io.emit('userDisconnect', socket.id)
      })
      .catch(console.log)
  })
  socket.on('message', msg => {
    io.emit('message', msg)
  })
  socket.on('move', async (name, coords) => {
    const udpate = await db.collection('users').doc(name).set({coords}, {merge: true})
    io.emit('move', socket.id, coords)
  })
}

module.exports = handleExports
