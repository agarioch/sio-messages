const express = require('express')
const http = require('http')
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if(!username) {
    return next(new Error('invalid username'))
  }
  // here we add a custom attribute to the socket object
  socket.username = username;
  next();
})
io.on('connection', (socket) => {
  // fetch existing users
  const users = [];
  for (let [id, socket] of io.of('/').sockets) {
    users.push({
      userID: id,
      username: socket.username,
    })
  }
  socket.emit('users', users);
  // notify existing users
  socket.broadcast.emit('user connected', {
    userID: socket.id,
    username: socket.username,
  })

  // notify users upon disconnection
  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', socket.id);
  })
})

app.get('/', (req, res) => res.end('server works'));

const PORT = process.env.PORT || 3001;

server.listen(PORT, console.log(`server listening on http://localhost:${PORT}`))