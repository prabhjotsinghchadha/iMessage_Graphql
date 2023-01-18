declare const resolvers: {
    Query: {
        searchUsers: (_: any, args: {
            username: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<import(".prisma/client").User[]>;
    };
    Mutation: {
        createUsername: (_: any, args: {
            username: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<import("../../util/types").CreateUsernameResponse>;
    };
} & {
    Query: {
        conversations: (_: any, __: any, context: import("../../util/types").GraphQLContext) => Promise<(import(".prisma/client").Conversation & {
            participants: (import(".prisma/client").ConversationParticipant & {
                user: {
                    id: string;
                    username: string | null;
                };
            })[];
            latestMessage: (import(".prisma/client").Message & {
                sender: {
                    id: string;
                    username: string | null;
                };
            }) | null;
        })[]>;
    };
    Mutation: {
        createConversation: (_: any, args: {
            participantIds: string[];
        }, context: import("../../util/types").GraphQLContext) => Promise<{
            conversationId: string;
        }>;
    };
    Subscription: {
        conversationCreated: {
            subscribe: import("graphql-subscriptions").ResolverFn;
        };
    };
} & {
    Query: {
        messages: (_: any, args: {
            conversationId: string;
        }, context: import("../../util/types").GraphQLContext) => Promise<(import(".prisma/client").Message & {
            sender: {
                id: string;
                username: string | null;
            };
        })[]>;
    };
    Mutation: {
        sendMessage: (_: any, args: import("../../util/types").SendMessageArguments, context: import("../../util/types").GraphQLContext) => Promise<boolean>;
    };
    Subscription: {
        messageSent: {
            subscribe: import("graphql-subscriptions").ResolverFn;
        };
    };
} & {
    Date: import("graphql").GraphQLScalarType<Date | null, any>;
};
export default resolvers;
