import { GraphQLContext, MessagePopulated, SendMessageArguments } from "../../util/types";
declare const resolvers: {
    Query: {
        messages: (_: any, args: {
            conversationId: string;
        }, context: GraphQLContext) => Promise<Array<MessagePopulated>>;
    };
    Mutation: {
        sendMessage: (_: any, args: SendMessageArguments, context: GraphQLContext) => Promise<boolean>;
    };
    Subscription: {
        messageSent: {
            subscribe: import("graphql-subscriptions").ResolverFn;
        };
    };
};
export declare const messagePopulated: {
    sender: {
        select: {
            id: true;
            username: true;
        };
    };
};
export default resolvers;
