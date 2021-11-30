import React, { useEffect, useState } from 'react';
import { ChakraProvider, Box, Text, Flex, theme } from '@chakra-ui/react';
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
  // useEffect(() => {
  socket.on('connect_error', (err) => {
    if (err.message === 'invalid username') {
      setUsernameSelected(false);
    }
  });
  socket.on('connection', () => {
    // console.log('⚡️ socket.io connected', socket.connected);
  });

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        {usernameSelected ? <Chat /> : <Login handleLogin={handleLogin} />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
