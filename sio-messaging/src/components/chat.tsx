import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, VStack, Heading, Divider } from '@chakra-ui/react';
import socket from '../services/socket';
import MessageCard from './message-card';
import UserCard from './user-card';
import ChatForm from './chat-form';
import { Message, User } from '../types/types';

const initReactiveProperties = (user: User) => {
  user.connected = true;
  user.messages = [];
  user.hasNewMessages = false;
};

const Chat: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // SEND MESSAGE - emit message and add to user
  const handleSubmit = (content: string) => {
    if (selectedUser) {
      socket.emit('private message', {
        content,
        to: selectedUser.userID,
      });
      selectedUser.messages.push({
        content,
        fromSelf: true,
      });

      setSelectedUser({
        ...selectedUser,
      });
    }
  };

  // SELECT USER
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    // GET USERS ON FIRST CONNECT - get online users
    socket.on('users', (users) => {
      users.forEach((user: User) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // sort users with self at top and then alphabetical
      const sortedUsers = users.sort((a: User, b: User) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(sortedUsers);
    });
    // ANOTHER USER CONNECTED - add to users
    socket.on('user connected', (user: User) => {
      initReactiveProperties(user);
      setUsers((priorState) => {
        return [...priorState, user];
      });
    });
    // ANOTHER USER DISCONNECTED - set connected false
    socket.on('user disconnected', (id: string) => {
      setUsers((priorState) => {
        return priorState.map((user) => {
          return user.userID === id ? { ...user, connected: false } : user;
        });
      });
    });
    // DISCONNECT - set connected false
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

    type PrivateMessage = {
      content: string;
      from: string;
    };
    // RECIEVE MESSAGE - store with sending user
    socket.on('private message', ({ content, from }: PrivateMessage) => {
      setUsers((priorUsers) => {
        return priorUsers.map((user) => {
          if (user.userID === from) {
            return {
              ...user,
              messages: [...user.messages, { content, fromSelf: false }],
              hasNewMessages: user?.userID !== selectedUser?.userID,
            };
          }
          return user;
        });
      });
      setSelectedUser((prior) => {
        if (prior === null) return null;
        if (prior?.userID === from) {
          return {
            ...prior,
            messages: [...prior.messages, { content, fromSelf: false }],
          };
        } else return prior;
      });
    });
    return () => {
      socket.close();
    };
  }, [socket]);
  console.log('rendering!!');
  return (
    <Flex minH="100vh">
      <Box minW="16rem" backgroundColor="gray.200">
        <Text>Online Users</Text>
        <VStack m={5} spacing={3} alignItems="flex-start">
          {users.map((user) => (
            <UserCard
              key={user.userID}
              handleSelectUser={handleSelectUser}
              user={user}
              selectedUser={selectedUser}
            />
          ))}
        </VStack>
      </Box>

      {selectedUser && (
        <Flex
          direction="column"
          justify="space-between"
          flexGrow={1}
          p={5}
          maxW="40rem"
        >
          <Heading size="mg">
            Chat with{' '}
            <span style={{ color: 'var(--chakra-colors-blue-600)' }}>
              {selectedUser.username}
            </span>
          </Heading>
          <Divider></Divider>
          <Flex direction="column" grow="1" justify="flex-end" minW="30rem">
            {selectedUser.messages &&
              selectedUser.messages.map((message: Message, i: number) => (
                <MessageCard key={i} message={message} />
              ))}
          </Flex>
          <ChatForm handleSubmit={handleSubmit} />
        </Flex>
      )}
    </Flex>
  );
};

export default Chat;
