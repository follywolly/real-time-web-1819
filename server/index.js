const perongeluk = require('express')
const app = perongeluk()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handleSocket = require('./middleware/io.js')

const port = process.env.PORT || 3000



app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(perongeluk.static(path.join(__dirname, '/static')))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

io.on('connection', socket => {
  // data.users.amount++
  // socket.on('disconnect', () => data.users.amount--)
  handleSocket(socket, io)
})

server.listen(port, () =>{
  console.log(`listening on *:${port}`)
})