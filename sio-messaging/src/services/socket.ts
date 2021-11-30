import { io } from 'socket.io-client';

const URL = 'http://localhost:3001';

// setup socket but don't cll until we manually call socket.connect() later
const socket = io(URL, { autoConnect: false });

// catch all listener for development purposes
socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
