import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, theme } from '@chakra-ui/react';
import Chat from './components/chat';
import Login from './components/login';
import socket from './services/socket';

export const App: React.FC = () => {
  const [usernameSelected, setUsernameSelected] = useState(false);
  const handleLogin = (username: string) => {
    setUsernameSelected(true);
    socket.auth = { username };
    socket.connect();
  };

  useEffect(() => {
    const sessionID = localStorage.getItem('sessionID');

    if (sessionID) {
      console.log('localStorage:sessionID', sessionID);
      setUsernameSelected(true);
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on(
      'session',
      ({ sessionID, userID }: { sessionID: string; userID: string }) => {
        // attach session ID to next reconnection attempts
        socket.auth = { sessionID };
        // store in localStorage
        localStorage.setItem('sessionID', sessionID);
        // save the ID of the user
        socket.userID = userID;
      }
    );

    if (socket) {
      socket.on('connect_error', (err) => {
        if (err.message === 'invalid username') {
          setUsernameSelected(false);
        }
      });
      socket.on('connection', () => {
        // console.log('⚡️ socket.io connected', socket.connected);
      });
    }
    return () => {
      socket.off('connect_error');
    };
  }, [socket]);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        {usernameSelected ? <Chat /> : <Login handleLogin={handleLogin} />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
