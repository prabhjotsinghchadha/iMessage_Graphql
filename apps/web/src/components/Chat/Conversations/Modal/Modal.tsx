import { useLazyQuery, useMutation } from '@apollo/client';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Stack, Input, Button } from '@chakra-ui/react'
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import UserOperations from '../../../../graphql/operations/user'
import ConversationOperations from '../../../../graphql/operations/conversation'
import { CreateConversationData, CreateConversationInputs, SearchedUser, SearchUsersData, SearchUsersInput } from '../../../../util/types';
import Participants from './Participants';
import UserSearchList from './UserSearchList';
import { Session } from 'next-auth';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session;
}

const ConversationModal: React.FC<ModalProps> = ({ session, isOpen, onClose }) => {

  const {
    user: { id: userId },
  } = session;

  const [username, setUsername] = useState('');
  const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
  const [searchUsers, { data, loading, error }] = useLazyQuery<SearchUsersData, SearchUsersInput>(UserOperations.Queries.searchUsers);
  const [createConversation, { loading: createConversationLoading }] = useMutation<CreateConversationData, CreateConversationInputs>(ConversationOperations.Mutations.createConversation)


  const onCreateConversation = async () => {
    const participantIds = [userId, ...participants.map((p) => p.id)];
    try {
      const { data } = await createConversation({
        variables: { participantIds, }
      })
      console.log("Here is search data", data)
    } catch (error: any) {
      console.log("createConversations error", error);
      toast.error(error?.message);
    }
  };


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
            {participants.length !== 0 && (
              <>
                <Participants
                  participants={participants}
                  removeParticipant={removeParticipant}
                />
                <Button
                  bg="brand.100"
                  _hover={{ bg: "brand.100" }}
                  width="100%"
                  mt={6}
                  isLoading={createConversationLoading}
                  onClick={onCreateConversation}
                >
                </Button>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConversationModal;
