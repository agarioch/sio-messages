import React from 'react';
import { Box, Text } from '@chakra-ui/layout';

const Message = ({ message }: { message: any }) => {
  return (
    <Box
      w="60%"
      maxW="md"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={3}
    >
      {message.fromSelf ? (
        <Text fontSize={{ base: 'md' }} textAlign="end">
          {message.content}
        </Text>
      ) : (
        <Text fontSize={{ base: 'md' }} textAlign="start">
          {message.content}
        </Text>
      )}
    </Box>
  );
};

export default Message;
