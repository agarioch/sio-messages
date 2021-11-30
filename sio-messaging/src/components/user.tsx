import { Box, Heading, Text } from '@chakra-ui/layout';
import React from 'react';

type UserProps = {
  user: string;
  connected: boolean;
  selected: boolean;
};

const User: React.FC<UserProps> = ({ user, connected, selected = false }) => {
  return (
    <Box textAlign="start">
      <Heading size="sm">
        {user}
        {selected && ' (you)'}
      </Heading>
      <Text
        fontSize="sm"
        fontWeight="600"
        color={connected ? 'green.700' : 'gray.400'}
      >
        {connected ? 'online' : 'offline'}
      </Text>
    </Box>
  );
};

export default User;
