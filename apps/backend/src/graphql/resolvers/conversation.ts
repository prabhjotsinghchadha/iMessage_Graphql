import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../util/types";

const resolvers = {
  Mutation: {
    createConversation: async (_: any,
      args: { participantsIds: Array<string> },
      context: GraphQLContext
    ) => {
      console.log('Inside create conversation', args)
      const { session } = context;
      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }
    },
  },
};

export default resolvers;
