import { Box, Input } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface MessageInputProps {
  session: Session;
  conversationId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ session, conversationId }) => {

  const [messageBody, setMessageBody] = useState("");
  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {

    } catch (error: any) {
      console.log("onSendMessage error", error)
      toast.error(error?.message);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={() => { }}>
        <Input
          value={messageBody}
          onChange={(event) => setMessageBody(event.target.value)}
          placeholder="New message"
          size="md"
          resize="none"
          _focus={{
            boxShadow: "none",
            border: "1px solid",
            borderColor: "whiteAplha.300",
          }}
        />
      </form>
    </Box>
  )
}

export default MessageInput;
