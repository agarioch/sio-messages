import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, VStack } from '@chakra-ui/react';
import socket from '../services/socket';
import Message from './message';
import User from './user';
import ChatForm from './chat-form';

const initReactiveProperties = (user: any) => {
  user.connected = true;
  user.messages = [];
  user.hasNewMessages = false;
};

const Chat: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // send messages and store with selected user
  const handleSubmit = (message: string) => {
    if (selectedUser) {
      socket.emit('private message', {
        content: message,
        to: selectedUser.userID,
      });
      selectedUser.messages.push({
        content: message,
        fromSelf: true,
      });
      const newMessages = selectedUser.messages;
      setSelectedUser((prior: any) => ({
        ...prior,
        messages: newMessages,
      }));
    }
  };

  // select a user to sent messages to
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
  };
  // get connected users
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
    // get connected users and setState
    socket.on('user connected', (user) => {
      initReactiveProperties(user);
      setUsers((priorState) => {
        // prior state will update
        return [...priorState, user];
      });
    });
    // get disconnected users and setState
    socket.on('user disconnected', (id) => {
      setUsers((priorState) => {
        return priorState.map((user) => {
          return user.userID === id ? { ...user, connected: false } : user;
        });
      });
    });
    // set own disconnected state
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
    // get private messages from other users
    socket.on('private message', ({ content, from }) => {
      console.log('@private message', content, from);
      setUsers((priorUsers) =>
        priorUsers.map((user) => {
          if (user.userID === from) {
            const messages = user.messages || [];
            messages.push({
              content,
              fromSelf: false,
              hasNewMessages: user?.userID !== selectedUser?.userID,
            });
            return {
              ...user,
              messages,
            };
          }
          return user;
        })
      );
    });
    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <Flex minH="100vh">
      <Box minW="16rem" backgroundColor="gray.200">
        <Text>Online Users</Text>
        <VStack m={5} spacing={3} alignItems="flex-start">
          {users.map((user) => (
            <User
              key={user.userID}
              handleSelectUser={handleSelectUser}
              user={user}
              selectedUser={selectedUser}
            />
          ))}
        </VStack>
      </Box>
      {selectedUser && (
        <Box flexGrow={1}>
          <Text>Messages</Text>
          {selectedUser.messages &&
            selectedUser.messages.map((message: any, i: number) => (
              <Message key={i} message={message} />
            ))}
          <ChatForm handleSubmit={handleSubmit} />
        </Box>
      )}
    </Flex>
  );
};

export default Chat;
