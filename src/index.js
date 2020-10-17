const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')


const app = express()
// Creates server outside of the express library
const server = http.createServer(app)
// Socket IO expects to be called with raw HTTP server
const io = socketio(server)

const port = process.env.PORT || 3000


// locates the public directory
const publicDirectoryPath = path.join(__dirname, '../public')

// Serve up the public directory
app.use(express.static(publicDirectoryPath))

const welcome = "Welcome!"

// new client connecting - socket is an object
io.on('connection', (socket) => {
  console.log('New Websocket connection')

  // sends an event from the server
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, username, room })

    if (error) {
      return callback(error)
    }

    socket.join(user.room)

    socket.emit('message', generateMessage('Admin','Welcome!'))
    socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    callback()
  })

  socket.on('sendMessage', (sendMessage, callback) => {
    const myUser = getUser(socket.id)
    const filter = new Filter()
    if (filter.isProfane(sendMessage)) {
      return callback('Profanity is not allowed')
    }

    io.to(myUser.room).emit('message', generateMessage(myUser.username, sendMessage))
    callback()
  })

  socket.on('sendLocation', (location, callback) => {
    const myUser = getUser(socket.id)
    if (!location) {
      return callback('Error finding location')
    }
    io.to(myUser.room).emit('location', generateLocationMessage(myUser.username, location))
    callback()
  })


  // runs when a client is disconnected
  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} has left the room`))
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      })
    }

  })

})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`)
})

