const users = []

const handleExports = (socket, io) => {
  socket.on('getUsers', cb => {
    cb(users)
  })
  socket.on('userConnect', user => {
    users.push(user)
    io.emit('userConnect', user)
  })
  socket.on('disconnect', () => {
    const i = users.findIndex(u => u.id === socket.id)
    if (i > -1) {
      users.splice(i, 1)
    }
    io.emit('userDisconnect', socket.id)
  })
  socket.on('message', msg => {
    io.emit('message', msg)
  })
  socket.on('move', user => {
    const i = users.findIndex(u => u.id === user.id)
    if (i > -1) {
      users[i] = Object.assign({}, users[i], user)
    }
    console.log(user);
    io.emit('move', user)
  })
}

module.exports = handleExports
