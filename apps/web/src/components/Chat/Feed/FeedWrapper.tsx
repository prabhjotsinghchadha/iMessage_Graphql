import { Session } from "next-auth";

interface FeedWrapper {
  session: Session;
}

const FeedWrapper: React.FC<FeedWrapper> = ({ session, }) => {
  return (
    <div>ConversationsWrapper</div>
  )
}

export default FeedWrapper;
