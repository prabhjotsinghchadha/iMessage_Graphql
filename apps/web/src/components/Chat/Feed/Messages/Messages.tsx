import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { MessagesData, MessagesVariables, MessageSubscriptionData } from "../../../../util/types";
import MessageOperations from '../../../../graphql/operations/messages';
import { toast } from "react-hot-toast";
import SkeletonLoader from "../../common/SkeletonLoader";
import { useEffect } from "react";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {

  const { data, loading, error, subscribeToMore } = useQuery<MessagesData, MessagesVariables>(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  })

  if (error) {
    return null;
  }

  const subscribeToMoreMessages = (conversationId: string) => {
    subscribeToMore({
      document: MessageOperations.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages: [newMessage, ...prev.messages]
        });
      },
    });
  };

  useEffect(() => {
    subscribeToMoreMessages(conversationId);
  }, [conversationId]);

  console.log("Here is Messages Data", data)

  return <Flex direction="column" justify="flex-end" overflow="hidden">
    {loading && (
      <Stack spacing={4} px={4}>
        <SkeletonLoader count={7} height="80px" />
      </Stack>
    )}
    {data?.messages && (
      <Flex direction="column-reverse" overflowY="scroll" height="100%">
        {data.messages.map((message) => (
          // <MessageItem />
          <div key={message.body}>{message.body}</div>
        ))}
      </Flex>
    )}
  </Flex>
}

export default Messages;
