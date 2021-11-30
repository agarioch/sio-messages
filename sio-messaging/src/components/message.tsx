import React from 'react';
import { Box, Text } from '@chakra-ui/layout';

const Message = ({ message }: { message: any }) => {
  return (
    <Box
      maxW="md"
      w="fit-content"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      px={5}
      py={2}
      textAlign={message.fromSelf ? 'end' : 'start'}
      alignSelf={message.fromSelf ? 'flex-end' : 'flex-start'}
      backgroundColor={message.fromSelf ? 'gray.100' : 'blue.100'}
    >
      <Text fontSize={{ base: 'md' }}>{message.content}</Text>
    </Box>
  );
};

export default Message;
