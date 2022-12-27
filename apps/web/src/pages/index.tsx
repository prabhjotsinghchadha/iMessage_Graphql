import { Box } from "@chakra-ui/react";
import { NextPageContext } from "next";
import { getSession, useSession } from "next-auth/react";
import Auth from "../components/Auth/Auth";
import Chat from "../components/Chat/Chat";

export default function Web() {
  const { data } = useSession();

  console.log('Here is data', data);

  return (
    <Box>
      {data?.user.username ? <Chat /> : <Auth />}
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
