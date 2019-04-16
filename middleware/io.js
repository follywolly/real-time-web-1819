
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
    if (user.name.length > 15) {
      user.name = user.name.substring(0,15)
    }
    io.emit('userConnect', user)
  })
  socket.on('disconnect', () => {
    db.collection('users').doc(socket.id).delete()
    io.emit('userDisconnect', socket.id)
  })
  socket.on('message', msg => {
    io.emit('message', msg)
  })
}

module.exports = handleExports
