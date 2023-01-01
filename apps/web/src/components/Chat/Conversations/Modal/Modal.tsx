import { Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react";

interface Modal {
  isOpen: boolean;
  onClose: () => void;
}

const ConverstationModal: React.FC<Modal> = ({ isOpen, onClose }) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Modal Body</Text>
          </ModalBody>

        </ModalContent>

      </Modal>
    </>
  )
}

export default ConverstationModal;
