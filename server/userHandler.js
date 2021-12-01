const userHandler = (io, socket) => {
  // check  all connected clients
  const users = [];
  for (let [id, socket] of io.of('/').sockets) {
    users.push({
      userID: id,
      username: socket.username,
    })
  }
  // send all users to new client
  socket.emit('users', users);
  // notify existing users of new client
  socket.broadcast.emit('user connected', {
    userID: socket.id,
    username: socket.username,
  })

  // PRIVATE MESSAGE - notify relevant client
  socket.on('private message', ({content, to}) => {
    console.log('sending private message', content, to)
    socket.to(to).emit('private message', {
      content: content,
      from: socket.id
    })
  })

  // DISCONNECT - notify other clients
  socket.on('disconnect', () => {
    socket.broadcast.emit('user disconnected', socket.id);
  })
}

module.exports = userHandler;