import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./Messages/Header";

interface FeedWrapper {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapper> = ({ session, }) => {
  const router = useRouter();
  const { user: { id: userId } } = session;

  const { conversationId } = router.query;
  return (
    <Flex width="100%" direction='column' display={{ base: conversationId ? "flex" : "none", md: "flex" }}>
      {conversationId && typeof conversationId === "string" ? (
        <Flex
          direction="column"
          justify="space-between"
          overflow="hidden"
          flexGrow={1}
        >
          {/* {conversationId} */}
          <MessagesHeader userId={userId} conversationId={conversationId} />
        </Flex>
      ) : (
        <div>No Conversation Selected</div>
      )}
    </Flex>
  )
}

export default FeedWrapper;
