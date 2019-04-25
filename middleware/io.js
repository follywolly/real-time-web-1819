const auth = require('./authentication.js')
const store = require('./store.js')

const genUser = user => {
  return {...user, currentCoords: user.coords, points: 0}
}

const handleExports = (socket, io, db) => {
  socket.on('login', (user, cb) => {
    const name = user.name
    const pass = user.pass
    if (name && pass) {
      auth.login(name, pass, db)
        .then(acc => {
          if (acc.online) {
            return cb({error: 'This account is already logged in'})
          }
          acc = genUser(acc)

          db.collection('users')
            .doc(acc.username)
            .set({online: true, socket: socket.id, room: user.room}, {merge: true})
            .then(() => {
              socket.join(user.room)
              store.pushState('scores', {room: user.room, player: acc.username, points: 0})
              store.pushState('users', {...acc, online: true, socket: socket.id, room: user.room})
              cb({...acc, online: true, socket: socket.id, room: user.room})
              const ref = db.collection('rooms').doc(user.room)
              ref.get()
                .then(doc => {
                  ref.set({users: doc.data().users + 1}, {merge: true})
                })
                .catch(console.log)
            })
            .catch(err => cb({error: err}))
        })
        .catch(err => cb({error: err}))
    } else {
      cb({error: 'No username or pass filled in'})
    }
  })
  socket.on('register', (user, cb) => {
    const name = user.name
    const pass = user.pass
    const repeat = user.repeat
    if (pass !== repeat) {
      return cb({error: 'The passwords you filled in did not match'})
    }
    if (name && pass && repeat) {
      auth.register(name, pass, db)
        .then(user => cb(user))
        .catch(err => cb({error: err}))
    } else {
      cb({error: 'Please fill in all fields'})
    }
  })
  socket.on('getUsers', async (room, cb) => {
    // db.collection('users').get()
    //   .then(data => {
    //     if (!data.docs) {
    //       return cb([])
    //     }
    //     const users = data.docs
    //       .filter(doc => doc.data().online)
    //       .map(doc => ({
    //           username: doc.data().username,
    //           socket: doc.data().socket,
    //           coords: doc.data().coords
    //         })
    //       )
    //     cb(users)
    //   })
    //   .catch(err => cb({error: err}))
    const users = store.getState('users').filter(user => user.room === room)
    const scores = store.getState('scores').filter(score => score.room === room)
    const weather = store.getState('weather').find(city => city.name.toLowerCase() === room)
    const crypto = store.getState('crypto')
    cb(users, scores, weather, crypto)

  })
  socket.on('userConnect', user => {
    io.to(user.room).emit('userConnect', user)
  })
  socket.on('disconnect', async () => {
    const onlineUsers = store.getState('users')
    const onlineScores = store.getState('scores')
    const i = onlineUsers.findIndex(user => user.socket === socket.id)
    if (i > -1) {
      const j = onlineScores.findIndex(score => score.player === onlineUsers[i].username)
      if (j > -1) {
        onlineScores.splice(j, 1)
        store.setState({scores: onlineScores})
      }
      onlineUsers.splice(i, 1)
      store.setState({users: onlineUsers})
    }

    const data = await db.collection('users').get()
    const doc = data.docs
      .find(doc => doc.data().socket === socket.id)

    if (!doc) return

    const user = doc.data()

    if (!user) return

    const ref = db.collection('rooms').doc(user.room)
    ref.get()
      .then(doc => {
        ref.set({users: doc.data().users - 1}, {merge: true})
      })

    db.collection('users')
      .doc(user.username)
      .set({online: false, socket: null},{merge: true})
      .then(() => io.to(user.room).emit('userDisconnect', socket.id))
      .catch(console.log)
  })
  socket.on('move', async (name, room, coords) => {
    const onlineUsers = store.getState('users')
    io.to(room).emit('move', socket.id, coords)
    const i = onlineUsers.findIndex(user => user.username === name)
    if (i > -1) {
      onlineUsers[i].coords = coords
      store.setState({users: onlineUsers})
    }
    const update = await db.collection('users')
      .doc(name)
      .set({coords}, {merge: true})
  })
  socket.on('currentPos', (name, coords) => {
    const onlineUsers = store.getState('users')
    const i = onlineUsers.findIndex(user => user.username === name)
    if (i > -1) {
      const userObj = onlineUsers[i]
      userObj.currentCoords = coords
      const coins = []
      const mapCoins = store.getState('coins')
      mapCoins.forEach((coinInstance, index) => {
        coinInstance.forEach((coin, i) => {
          if (coin.coords.toString() === coords.toString() && !coin.taken && coin.room === userObj.room) {
            coins.push(coin)
            mapCoins[index][i].taken = true
          }
        })

      })
      store.setState({coins: mapCoins})
      coins.forEach(coin => {
        io.to(userObj.room).emit('coin-taken', coin)
        onlineUsers[i].points += coin.price
      })
      const scores = onlineUsers.map(user => ({room: user.room, player: user.username, points: user.points}))
      store.setState({users: onlineUsers})
      store.setState({scores})
      io.to(userObj.room).emit('hit', scores.filter(score => score.room === userObj.room))
    }
  })
  socket.on('bomb', bomb => {
    const onlineUsers = store.getState('users')
    io.to(bomb.room).emit('bomb', bomb)
    setTimeout(() => {
      const hit = onlineUsers
        .filter(user => user.room === bomb.room)
        .filter(user => {
          const i = bomb.range.findIndex(coords => coords[0] === user.currentCoords[0] && coords[1] === user.currentCoords[1] && user.username !== bomb.player)
          return i > -1
        })
      if (hit.length === 0) return
      hit.forEach(user => {
        const i = onlineUsers.findIndex(online => online.username === user.username)
        if (i > -1) {
          onlineUsers[i].points -= 1000
          if (onlineUsers[i].points <= 0) {
            onlineUsers[i].points = 0
          }
        }
      })
      const i = onlineUsers.findIndex(online => online.username === bomb.player)
      if (i === -1 ) return
      onlineUsers[i].points += hit.length * 1000
      const userObj = onlineUsers[i]
      const scores = onlineUsers.map(user => ({room: user.room, player: user.username, points: user.points}))
      store.setState({users: onlineUsers})
      store.setState({scores})
      io.to(bomb.room).emit('hit', scores.filter(score => score.room === userObj.room))
    }, 2000)
  })
}

module.exports = handleExports
