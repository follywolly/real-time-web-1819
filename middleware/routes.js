const auth = require('./authentication.js')

const routes = {
  init(app, db) {
    app.get('/', (req, res) => {
      res.render('index.ejs', {error: ''})
    })
    app.get('/game', (req, res) => {
      console.log(req.session);
      res.render('game.ejs', {user: ''})
    })
    app.get('/register', (req, res) => {
      res.render('register.ejs', {error: ''})
    })
    app.post('/game', (req, res) => {
      const name = req.body.username
      const pass = req.body.password
      if (name && pass) {
        auth.login(name, pass, db)
          .then(() => res.redirect('/game'))
          .catch(err => {
            res.render('index.ejs', {error: err})
          })
      } else {
        res.render('index.ejs', {error: 'No username or password given'})
      }
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
          .then(user => {
            req.session.user = user
            res.redirect('/game')
          })
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
