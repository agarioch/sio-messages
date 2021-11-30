import { Badge, Box, Heading, Text } from '@chakra-ui/layout';
import React from 'react';
import { User } from '../types/types';

type UserProps = {
  user: User;
  handleSelectUser: (user: User) => void;
  selectedUser: User | null;
};

const UserCard: React.FC<UserProps> = ({
  user,
  handleSelectUser,
  selectedUser,
}) => {
  return (
    <Box
      textAlign="start"
      cursor="pointer"
      onClick={() => handleSelectUser(user)}
      backgroundColor={
        user?.userID === selectedUser?.userID ? 'blue.100' : 'transparent'
      }
      borderRadius=".5rem"
      px={4}
      py={1}
      w="100%"
    >
      <Heading size="sm">
        {user.username}
        {user.self && (
          <Badge backgroundColor="blue.100" color="blue.700" ml=".5rem">
            <i className="fas fa-user"></i>(you){' '}
          </Badge>
        )}
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

export default UserCard;
