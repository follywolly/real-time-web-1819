const auth = require('./authentication.js')

const routes = {
  init(app, db) {

    app.get('/', async (req, res) => {
      const data = await db.collection('rooms').get()
      const rooms = data.docs.map(doc => doc.data())
      res.render('index.ejs', {rooms})
    })
    app.get('/register', (req, res) => {
      res.render('register.ejs', {error: ''})
    })
    app.post('/register', async (req, res) => {
      const name = req.body.username
      const pass = req.body.password
      const repeat = req.body.repeat
      if (pass !== repeat) {
        return res.render('register.ejs', {error: 'The passwords you filled in did not match'})
      }
      if (name && pass && repeat) {
        auth.register(name, pass, db)
          .then(() => res.redirect('/'))
          .catch(err => {
            res.render('register.ejs', {error: err})
          })
      } else {
        res.render('register.ejs', {error: 'Please fill in all fields'})
      }
    })
  }
}

module.exports = routes
