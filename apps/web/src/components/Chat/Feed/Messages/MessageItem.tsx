import { Stack } from "@chakra-ui/react";
import { MessagePopulated } from "../../../../../../backend/src/util/types";

interface MessageItemProps {
  message: MessagePopulated;
  sentByMe: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, sentByMe }) => {
  return (
    <Stack>

    </Stack>
  )
}

export default MessageItem;
