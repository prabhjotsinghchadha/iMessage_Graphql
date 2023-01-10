import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessagesHeader from "./Messages/Header";
import MessageInput from "./Messages/Input";

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
        <>
          <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            {/* {conversationId} */}
            <MessagesHeader userId={userId} conversationId={conversationId} />
          </Flex>
          <MessageInput session={session} conversationId={conversationId} />
        </>
      ) : (
        <div>No Conversation Selected</div>
      )}
    </Flex>
  )
}

export default FeedWrapper;
