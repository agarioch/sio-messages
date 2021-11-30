import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, VStack } from '@chakra-ui/react';
import socket from '../services/socket';
import Messages from './messages';
import User from './user';

const initReactiveProperties = (user: any) => {
  user.connected = true;
  user.messages = [];
  user.hasNewMessages = false;
};

const Chat: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  // get connected users

  // custom hook
  useEffect(() => {
    socket.on('users', (users) => {
      users.forEach((user: any) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // update users with self sorted at top
      const sortedUsers = users.sort((a: any, b: any) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(sortedUsers);
    });

    socket.on('user connected', (user) => {
      initReactiveProperties(user);
      console.log(users); // always []
      setUsers((priorState) => {
        // prior state will update
        return [...priorState, user];
      });
    });
    // listen for other users disconnecting
    socket.on('user disconnected', (id) => {
      setUsers((priorState) => {
        return priorState.map((user) => {
          return user.userID === id ? { ...user, connected: false } : user;
        });
      });
    });

    socket.on('disconnect', () => {
      setUsers((priorUsers) =>
        priorUsers.map((user) => {
          if (user.self) {
            return { ...user, connected: false };
          }
          return user;
        })
      );
    });
    return () => {
      socket.close();
    };
  }, []);

  return (
    <Flex minH="100vh">
      <Box minW="16rem" backgroundColor="gray.200">
        <Text>Online Users</Text>
        <VStack m={5} spacing={3} alignItems="flex-start">
          {users.map((user) => (
            <User
              key={user.userID}
              user={user.username}
              connected={user.connected}
              selected={user.self}
            />
          ))}
        </VStack>
      </Box>
      <Box flexGrow={1}>
        <Text>Messages</Text>
        <Messages />
      </Box>
    </Flex>
  );
};

export default Chat;
