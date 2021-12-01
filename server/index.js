const express = require('express')
const http = require('http')
const { Server } = require('socket.io');
const {userHandler, userHandshake} = require('./userHandler');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

// USER MIDDLEWARE - validate and save username
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if(!username) {
    return next(new Error('invalid username'))
  }
  // add custom 'username' attribute to socket object
  socket.username = username;
  next();
})

// REGISTER EVENT HANDLERS - on new socket connection
const onSocketConnection = (socket) => {
  userHandler(io, socket);
} 

// LISTEN FOR CONNECTIONS - and register event handlers
io.on('connection', onSocketConnection)

app.get('/', (req, res) => res.end('server works'));

const PORT = process.env.PORT || 3001;

server.listen(PORT, console.log(`server listening on http://localhost:${PORT}`))