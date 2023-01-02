import { useLazyQuery } from '@apollo/client';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Stack, Input, Button } from '@chakra-ui/react'
import { useState } from 'react';
import UserOperations from '../../../../graphql/operations/user'
import { SearchUsersData, SearchUsersInput } from '../../../../util/types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [searchUsers, { data, loading, error }] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers)

  console.log("Here is search data", data)

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
    //searchUsers Query
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d pb={4}">
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={onSearch}>
              <Stack spacing={4}>
                <Input
                  placeholder="Enter a username"
                  value={username}
                  onChange={event => setUsername(event.target.value)}
                />
                <Button type="submit" disabled={!username} isLoading={loading}>Search</Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConversationModal;
