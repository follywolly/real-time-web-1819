// const users = []

const getUsers = db => {
  const users = db.collection('users')

  return new Promise((resolve, reject) => {
    users.get()
    .then(snap => {
      const result = snap.docs.map(doc => doc.data())
      resolve(result)
    })
    .catch(reject)
  })
}

const getUser = (db, id) => {
  return new Promise((resolve, reject) => {
    db.collection('users').doc(id).get()
    .then(doc => resolve(doc.data()))
    .catch(reject)
  })
}

const handleExports = (socket, io, db) => {

  socket.on('getUsers', async cb => {
    const data = await getUsers(db)
    cb(data)
  })
  socket.on('userConnect', user => {
    db.collection('users').doc(user.id).set(user)
    io.emit('userConnect', user)
  })
  socket.on('disconnect', () => {
    db.collection('users').doc(socket.id).delete()
    io.emit('userDisconnect', socket.id)
  })
  socket.on('message', msg => {
    io.emit('message', msg)
  })
  socket.on('move', async user => {
    const existing = await getUser(db, user.id)
    const merge = Object.assign({}, existing, user)
    db.collection('users').doc(user.id).set(merge)
    io.emit('move', user)
  })
}

module.exports = handleExports
