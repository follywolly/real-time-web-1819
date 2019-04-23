require('dotenv').config()
const perongeluk = require('express')
const app = perongeluk()
const path = require('path')
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const handleSocket = require('./middleware/io.js')
const firebase = require('firebase-admin')
const bodyParser = require('body-parser')
const routes = require('./middleware/routes.js')
const session = require('express-session')
const pullWeatherData = require('./middleware/weather.js')

const port = process.env.PORT || 3000

const serviceAccount = require('./webdev-weatherworld.json')

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://webdev-weatherworld.firebaseio.com'
})
const db = firebase.firestore()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))
app.use(perongeluk.static(path.join(__dirname, '/static')))

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 60 * 60 * 24 * 7
    }
  })
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

routes.init(app, db)

io.on('connection', socket => {
  handleSocket(socket, io, db)
})

pullWeatherData(io, db)


server.listen(port, () =>{
  console.log(`listening on *:${port}`)
})
