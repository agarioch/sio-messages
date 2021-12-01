import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client';

interface ExtendedSocket extends Socket {
  userID?: string;
}

const URL = 'http://localhost:3001';

// setup socket but don't cll until we manually call socket.connect() later
const socket: ExtendedSocket = io(URL, { autoConnect: false });

// catch all listener for development purposes
socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
