import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from '../../../graphql/operations/conversation'
import { ConversationsData } from "../../../util/types";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import { useEffect } from "react";

interface ConversationsWrapper {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapper> = ({ session, }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore
  } = useQuery<ConversationsData, null>(
    ConversationOperations.Queries.conversations
  );

  const onViewConversations = async (conversationId: string) => {
    /**
    * 1. Push the conversationId to the router query prams
    *
    * 2. Mark the conversation as read
    *
    */
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        { subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated }
          }
        }
      ) => {
        if (!subscriptionData.data) return prev;

        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      }
    })
  }

  /**
* Execute subscription on mount
*/
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box width={{ base: "100%", md: "400px" }} bg="whiteAlpha.50" py={6} px={3} >
      {/* Skeleton Loader */}
      <ConversationList session={session} conversations={conversationsData?.conversations || []} />
    </Box>
  )
}

export default ConversationsWrapper;
