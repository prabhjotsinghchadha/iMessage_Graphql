import { useQuery } from "@apollo/client";
import { Flex } from "@chakra-ui/react";
import { MessagesData, MessagesVariables } from "../../../../util/types";
import MessageOperations from '../../../../graphql/operations/messages';
import { toast } from "react-hot-toast";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {

  const { data } = useQuery<MessagesData, MessagesVariables>(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  })

  return <Flex direction="column" justify="flex-end" overflow="hidden">

  </Flex>
}

export default Messages;
