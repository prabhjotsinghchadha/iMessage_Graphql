import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from '../../../graphql/operations/conversation'
import { ConversationsData } from "../../../util/types";
import { ConversationPopulated } from "../../../../../backend/src/util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonLoader from "../common/SkeletonLoader";

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
  const router = useRouter();
  const { query: { conversationId } } = router;

  const onViewConversation = async (conversationId: string) => {
    /**
    * 1. Push the conversationId to the router query prams
    *
    * 2. Mark the conversation as read
    *
    */

    router.push({ query: { conversationId } });
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
    <Box
      display={{ base: conversationId ? "none" : "flex", md: "flex" }}
      width={{ base: "100%", md: "400px" }}
      flexDirection="column"
      bg="whiteAlpha.50"
      gap={4}
      py={6}
      px={3} >
      {conversationsLoading ? (
        <SkeletonLoader count={7} height="80px" />
      ) : (
        <ConversationList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  )
}

export default ConversationsWrapper;
