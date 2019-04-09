import dom from './helpers/dom.js'
import helper from './helpers/general.js'

const socket = io()
let user = 'anonymous'
let id
socket.on('connect', () => {
  id = socket.io.engine.id
})




;(() => {
  const form = document.querySelector('#chat-form')

  if (form) {
    const input = document.querySelector('#chat')
    form.addEventListener('submit', e => {
      e.preventDefault()
      socket.emit('message', {user, id, val: input.value})
      input.value = ''
    })
  }

  const userForm = document.querySelector('#user-form')
  if (userForm) {
    const input = document.querySelector('#user-input')
    userForm.addEventListener('submit', e => {
      e.preventDefault()
      user = input.value
      userForm.classList.add('hide')
    })
  }
  // bar()

  const messages = document.querySelector('#messages')
  socket.on('message', msg => {
    const messageNodes = document.querySelectorAll('.message')
    let nodeClass = ['message']
    if (messageNodes && messageNodes.length > 0) {
      const lastUser = messageNodes[messageNodes.length - 1].dataset.user
      console.log(lastUser, msg.id);
      if (lastUser === msg.id) {
        nodeClass.push('same-user')
      }
    }
    if (msg.id === id) {
      nodeClass.push('client')
    }
    const li = dom.appendElTo(messages, 'li', {class: nodeClass})
    li.dataset.user = msg.id
    dom.appendElTo(li, 'span', {text: msg.user, class: 'begin'})
    dom.appendElTo(li, 'span', {text: msg.val, class: 'end'})
  })
})()


// let users = []
// let timestamps = []

// function bar() {
//   const initData = {
//     labels: ['users'],
//     series: [[users]]
//   }
//   const options = {
//     low: 0,
//     showArea: true,
//     axisY: {
//
//       scaleMinSpace: 20,
//       onlyInteger: true
//     }
//
//   }
//   console.log(Chartist);
//   const line = new Chartist.Line('#bar-users', initData, options)
//
//   socket.on('users', data => {
//
//     users.push(data.amount)
//     const time = helper.formatTime(new Date(data.time))
//     timestamps.push(time)
//
//     if (users.length > 4) {
//       users.shift()
//       timestamps.shift()
//     }
//
//     line.update({labels: timestamps, series: [users]}, options)
//   })
// }
