import { useMutation } from "@apollo/client";
import { Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import UserOperations from '../../graphql/operations/user';
import { CreateUseranameData, CreateUsernameVariables } from "../../util/types";
import toast from "react-hot-toast";

interface IAuthProps {
  session: Session | null;
  reloadSession: () => void;
}


const Auth: React.FC<IAuthProps> = ({ session, reloadSession }) => {

  const [username, setUsername] = useState("");

  const [createUsername, { data, loading, error }] = useMutation<
    CreateUseranameData,
    CreateUsernameVariables
  >(UserOperations.Mutations.createUsername)

  //console.log("Here is data", data, loading, error);

  const onSubmit = async () => {
    if (!username) return;
    try {
      // await createUsername({ variables: { username } })
      const { data } = await createUsername({
        variables: {
          username,
        },
      });

      if (!data?.createUsername) {
        throw new Error();
      }

      if (data.createUsername.error) {
        const {
          createUsername: { error },
        } = data;

        toast.error(error);
        return;
      }

      toast.success("Username successfully created");

      /**
       * Reload session to obtain new username
       */
      reloadSession();
    } catch (error) {
      console.log('onSubmit error', error);
    }
  }

  return (
    <Center height="100vh">
      <Stack align="center" spacing="8">
        {session ? (
          <>
            <Text fontSize="3xl">Create a Username</Text>
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)} />
            <Button onClick={onSubmit} width="100%" isLoading={loading}>Save</Button>
          </>
        ) : (
          <>
            <Text fontSize="3xl">MessengerQL</Text>
            <Button onClick={() => signIn('google')} leftIcon={<Image height='40' width='40' src='/images/googlelogo.png' alt="google logo" />}>Continue with Google</Button>
          </>
        )}
      </Stack>
    </Center>
  );
};

export default Auth;
