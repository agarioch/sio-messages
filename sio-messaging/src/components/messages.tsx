import React from 'react';
import { Box, Text, VStack } from '@chakra-ui/layout';

const Messages = () => {
  return (
    <VStack spacing={2} alignItems="start" p={3}>
      <Box
        w="60%"
        maxW="md"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={3}
      >
        <Text fontSize={{ base: 'md' }} textAlign="start">
          This is a test message
        </Text>
      </Box>
    </VStack>
  );
};

export default Messages;
