import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Text } from '@chakra-ui/react'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConversationModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Modal Boday</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConversationModal;
