import { useMutation } from "@apollo/client";
import { Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import UserOperations from '../../graphql/operations/user';
import { CreateUseranameData, CreateUsernameVariables } from "../../util/types";

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

  const onSubmit = async () => {
    try {
      await createUsername({ variables: { username } })
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
            <Button onClick={onSubmit} width="100%">Save</Button>
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
