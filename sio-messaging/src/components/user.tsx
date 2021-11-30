import { Box, Heading, Text } from '@chakra-ui/layout';
import React from 'react';

type UserProps = {
  user: any;
  handleSelectUser: (user: any) => void;
  selectedUser: any;
};

const User: React.FC<UserProps> = ({
  user,
  handleSelectUser,
  selectedUser,
}) => {
  return (
    <Box
      textAlign="start"
      onClick={() => handleSelectUser(user)}
      backgroundColor={
        user?.userID === selectedUser?.userID ? 'blue.200' : 'transparent'
      }
      borderRadius=".5rem"
      px={4}
      py={1}
      w="100%"
    >
      <Heading size="sm">
        {user.username}
        {user.self && ' (you)'}
      </Heading>
      <Text
        fontSize="sm"
        fontWeight="600"
        color={user.connected ? 'green.700' : 'gray.400'}
      >
        {user.connected ? 'online' : 'offline'}
      </Text>
    </Box>
  );
};

export default User;
