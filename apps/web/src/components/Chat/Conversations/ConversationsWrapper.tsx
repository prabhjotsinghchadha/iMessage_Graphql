import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";

interface ConversationsWrapper {
  session: Session;
}

const ConversationsWrapper: React.FC<ConversationsWrapper> = ({ session, }) => {
  return (
    <Box width={{ base: "100%", md: "400px" }}>
      {/* Skeleton Loader */}
      <ConversationList session={session} />
    </Box>
  )
}

export default ConversationsWrapper;
