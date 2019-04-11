const moves = []

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
    cb(
      data.map(user => {
        const move = moves.find(move => move.id === user.id)
        return move ? Object.assign({}, move, user) : user
      })
    )
  })
  socket.on('userConnect', user => {
    moves.push({id: user.id})
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
    const i = moves.findIndex(u => u.id === user.id)
    if (i > -1) {
      const merge = Object.assign({}, moves[i], user)
      moves[i] = merge
    }
    io.emit('move', user)
  })
}

module.exports = handleExports
