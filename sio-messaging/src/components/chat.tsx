import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, VStack } from '@chakra-ui/react';
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

  // send messages and store with selected user
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

      const newMessages = selectedUser.messages;
      setSelectedUser({
        ...selectedUser,
        messages: newMessages,
      });
    }
  };

  // select a user to sent messages to
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };
  // get connected users
  useEffect(() => {
    socket.on('users', (users) => {
      users.forEach((user: User) => {
        user.self = user.userID === socket.id;
        initReactiveProperties(user);
      });
      // update users with self sorted at top
      const sortedUsers = users.sort((a: User, b: User) => {
        if (a.self) return -1;
        if (b.self) return 1;
        if (a.username < b.username) return -1;
        return a.username > b.username ? 1 : 0;
      });
      setUsers(sortedUsers);
    });
    // get connected users and setState
    socket.on('user connected', (user: User) => {
      initReactiveProperties(user);
      setUsers((priorState) => {
        // prior state will update
        return [...priorState, user];
      });
    });
    // get disconnected users and setState
    socket.on('user disconnected', (id: string) => {
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

    type PrivateMessage = {
      content: string;
      from: string;
    };
    // get private messages from other users
    socket.on('private message', ({ content, from }: PrivateMessage) => {
      setUsers((priorUsers) =>
        priorUsers.map((user) => {
          if (user.userID === from) {
            const messages = user.messages || [];
            messages.push({
              content,
              fromSelf: false,
            });
            return {
              ...user,
              messages,
              hasNewMessages: user?.userID !== selectedUser?.userID,
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
          <Text mb={5}>Messages</Text>
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
