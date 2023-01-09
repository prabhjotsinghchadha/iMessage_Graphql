import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";

interface FeedWrapper {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapper> = ({ session, }) => {
  const router = useRouter();

  const { conversationId } = router.query;
  return (
    <Flex width="100%" direction='column' display={{ base: conversationId ? "flex" : "none", md: "flex" }}>
      {conversationId ? <Flex></Flex> : <div>No Conversation Selected</div>}
    </Flex>
  )
}

export default FeedWrapper;
