import { useLazyQuery } from '@apollo/client';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Stack, Input, Button } from '@chakra-ui/react'
import { useState } from 'react';
import UserOperations from '../../../../graphql/operations/user'
import { SearchedUser, SearchUsersData, SearchUsersInput } from '../../../../util/types';
import Participants from './Participants';
import UserSearchList from './UserSearchList';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers)

  console.log("Here is search data", data)

  const onSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    searchUsers({ variables: { username } });
    //searchUsers Query
  }

  const addParticipant = (user: SearchedUser) => {
    setParticipants(prev => [...prev, user]);
  }

  const removeParticipant = (userId: string) => {
    setParticipants(prev => prev.filter((p) => p.id !== userId));
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="#2d2d2d pb={4}">
          <ModalHeader>Create a Conversation</ModalHeader>
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
            {data?.searchUsers &&
              <UserSearchList
                users={data.searchUsers}
                addParticipant={addParticipant}
              />}
            {participants.length !== 0 && (<Participants participants={participants} removeParticipant={removeParticipant} />)}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConversationModal;
