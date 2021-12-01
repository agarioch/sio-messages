const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { userHandler, userHandshake } = require('./userHandler');

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: 'http://localhost:3000' },
});
// handshake middelware
io.use(userHandshake);

// listen for connections and register events
io.on('connection', (socket) => {
  userHandler(io, socket);
});

app.get('/', (req, res) => res.end('server works'));

server.listen(
  PORT,
  console.log(`server listening on http://localhost:${PORT}`)
);
