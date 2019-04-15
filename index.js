const perongeluk = require('express')
const app = perongeluk()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handleSocket = require('./middleware/io.js')
const firebase = require('firebase-admin')

const port = process.env.PORT || 3000

const serviceAccount = require('./webdev-rtw.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://webdev-rtw.firebaseio.com'
})
const db = firebase.firestore()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(perongeluk.static(path.join(__dirname, '/static')))

app.get('/', (req, res) => {
  res.render('index.ejs')
})

io.on('connection', socket => {
  handleSocket(socket, io, db)
})

server.listen(port, () =>{
  console.log(`listening on *:${port}`)
})
