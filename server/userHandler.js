const crypto = require("crypto");
const { InMemorySessionStore } = require("./sessionStore");

// generate unique ID
const randomId = () => crypto.randomBytes(8).toString("hex");
const sessionStore = new InMemorySessionStore();

const userHandshake = (socket, next) => {
  const sessionID = socket.username.auth.sessionID;
  if (sessionID) {
    // find existing session
    const session = sessionStore.findSession(sessionID);
    if(session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }

  const username = socket.handshake.auth.username;
  if(!username) {
    return next(new Error('invalid username'))
  }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
}

const userHandler = (io, socket) => {
  // PERSIST SESSION
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    username: socket.username,
    contected: true,
  });
  // emit session details
  socket.emit('session', {
    sessionID: socket.sessionID,
    userID: socket.userID,
  });
  // join user ID room
  socket.join(socket.userID);

  // SEND USERS
  const users = [];
  // get all connected clients
  sessionStore.findAllSessions().forEach(session => {
    users.push({
      userID: session.id,
      username: session.username,
      connected: session.connected,
    })
  });
  // send all users to new client
  socket.emit('users', users);
  // notify existing users of new client
  socket.broadcast.emit('user connected', {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  })

  // PRIVATE MESSAGE - notify relevant client (and other tabs of sender)
  socket.on('private message', ({content, to}) => {
    console.log('sending private message', content, to)
    socket.to(to).to(socket.userID).emit('private message', {
      content: content,
      from: socket.userID,
      to,
    })
  })

  // DISCONNECT - notify other clients
  socket.on('disconnect', async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if(isDisconnected) {
      socket.broadcast.emit('user disconnected', socket.userID);
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: false,
      })
    }
    
  })
}

module.exports = {userHandler, userHandshake};