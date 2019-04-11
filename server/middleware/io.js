const handleExports = (socket, io) => {
  console.log('user connected')
  socket.on('userConnect', user => {
    io.emit('userConnect', user)
  })
  socket.on('disconnect', () => {
    io.emit('userDisconnect', socket.id)
  })
  socket.on('message', msg => {
    io.emit('message', msg)
  })
  socket.on('move', user => {
    io.emit('move', user)
  })
}

module.exports = handleExports
