import { ConversationPopulated, GraphQLContext } from "../../util/types";
declare const resolvers: {
    Query: {
        conversations: (_: any, __: any, context: GraphQLContext) => Promise<Array<ConversationPopulated>>;
    };
    Mutation: {
        createConversation: (_: any, args: {
            participantIds: Array<string>;
        }, context: GraphQLContext) => Promise<{
            conversationId: string;
        }>;
    };
    Subscription: {
        conversationCreated: {
            subscribe: import("graphql-subscriptions").ResolverFn;
        };
    };
};
export interface ConversationCreatedSubscriptionPayload {
    conversationCreated: ConversationPopulated;
}
export declare const participantPopulated: {
    user: {
        select: {
            id: true;
            username: true;
        };
    };
};
export declare const conversationPopulated: {
    participants: {
        include: {
            user: {
                select: {
                    id: true;
                    username: true;
                };
            };
        };
    };
    latestMessage: {
        include: {
            sender: {
                select: {
                    id: true;
                    username: true;
                };
            };
        };
    };
};
export default resolvers;
