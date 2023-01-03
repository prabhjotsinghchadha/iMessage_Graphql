import { Flex, Stack, Text } from "@chakra-ui/react";
import { SearchedUser } from "../../../../util/types";

interface UserSearchListProps {
  users: Array<SearchedUser>

}

const UserSearchList: React.FC<UserSearchListProps> = ({ users }) => {
  return (
    <>
      {users.length === 0 ? (
        <Flex mt={6} justify="center">
          <Text color="tomato">No users found</Text>
        </Flex>
      ) : (
        <Stack></Stack>
      )}
    </>
  )
}

export default UserSearchList;
