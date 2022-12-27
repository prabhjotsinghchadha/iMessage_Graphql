import { Box } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Auth from "../components/Auth/Auth";
import Chat from "../components/Chat/Chat";

export default function Web() {
  const { data: session } = useSession();

  console.log('Here is Session', session);

  const reloadSession = () => {

  };

  return (
    <Box>
      {session?.user.username ? <Chat /> : <Auth session={session} reloadSession={reloadSession} />}
    </Box>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context)

  return {
    props: {
      session,
    },
  };
}
