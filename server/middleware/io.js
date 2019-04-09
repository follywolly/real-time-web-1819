const handleExports = (socket, io) => {
  console.log('user connected')
  socket.on('message', msg => {
    console.log('message: ' + msg)
    io.emit('message', msg)
  })
}

module.exports = handleExports
