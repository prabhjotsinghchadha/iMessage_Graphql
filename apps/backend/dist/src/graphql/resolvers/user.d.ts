import { User } from "@prisma/client";
import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
declare const resolvers: {
    Query: {
        searchUsers: (_: any, args: {
            username: string;
        }, context: GraphQLContext) => Promise<Array<User>>;
    };
    Mutation: {
        createUsername: (_: any, args: {
            username: string;
        }, context: GraphQLContext) => Promise<CreateUsernameResponse>;
    };
};
export default resolvers;
