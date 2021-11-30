import React, { useEffect, useState } from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';
import socket from '../services/socket';
import Messages from './messages';

const initReactiveProperties = (user: any) => {
  user.connected = true;
  user.messages = [];
  user.hasNewMessages = false;
};

const Chat: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  // get connected users
  useEffect(() => {
    socket.on('users', (users) => {
      users.forEach((user: any) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // update users with self sorted at top
      setUsers(
        users.sort((a: any, b: any) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        })
      );
    });

    socket.on('user connected', (user) => {
      initReactiveProperties(user);
      console.log(user);
      setUsers((users) => [...users, user]);
    });
  }, []);
  return (
    <Flex minH="100vh">
      <Box minW="16rem" backgroundColor="gray.200">
        <Text>Online Users</Text>
        {users.map((user) => (
          <p key={user.id}>{user.username}</p>
        ))}
      </Box>
      <Box flexGrow={1}>
        <Text>Messages</Text>
        <Messages />
      </Box>
    </Flex>
  );
};

export default Chat;
