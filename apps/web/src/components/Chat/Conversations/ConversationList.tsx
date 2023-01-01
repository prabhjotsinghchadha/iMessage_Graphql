import { Session } from "next-auth";

interface ConversationList {
  session: Session;
}

const ConversationList: React.FC<ConversationList> = ({ session, }) => {
  return (
    <div>ConversationList</div>
  )
}

export default ConversationList;
