import React, { useState } from 'react';
import { Stack, FormControl, Button, Input } from '@chakra-ui/react';

const ChatForm = ({
  handleSubmit,
}: {
  handleSubmit: (content: string) => void;
}) => {
  const [state, setState] = useState<'initial' | 'submitting' | 'success'>(
    'initial'
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      as={'form'}
      w="60%"
      minW="30rem"
      spacing={'12px'}
      onSubmit={(e) => {
        e.preventDefault();
        setError(false);
        setState('submitting');
        handleSubmit(message);
        setMessage('');
        setState('success');
        setTimeout(() => setState('initial'), 200);
      }}
    >
      <FormControl>
        <Input
          variant={'solid'}
          borderWidth={1}
          color={'gray.800'}
          _placeholder={{
            color: 'gray.400',
          }}
          borderColor="gray.300"
          id={'name'}
          type={'name'}
          required
          placeholder={'Enter message ...'}
          aria-label={'Enter message ...'}
          value={message}
          disabled={state !== 'initial'}
          onChange={(e) => setMessage(e.target.value)}
        />
      </FormControl>
      <FormControl w={{ base: '100%', md: '40%' }}>
        <Button
          colorScheme={state === 'success' ? 'green' : 'blue'}
          isLoading={state === 'submitting'}
          w="100%"
          type={state === 'success' ? 'button' : 'submit'}
        >
          {state === 'success' ? '✓' : 'Submit'}
        </Button>
      </FormControl>
    </Stack>
  );
};

export default ChatForm;
