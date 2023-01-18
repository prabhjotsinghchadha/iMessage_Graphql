"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationPopulated = exports.participantPopulated = void 0;
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const resolvers = {
    Query: {
        conversations: async (_, __, context) => {
            const { session, prisma } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not Authorized");
            }
            const { user: { id: userId }, } = session;
            try {
                const conversations = await prisma.conversation.findMany({
                    include: exports.conversationPopulated,
                });
                return conversations.filter(conversation => !!conversation.participants.find(p => p.userId === userId));
            }
            catch (error) {
                console.log("conversations error", error);
                throw new graphql_1.GraphQLError(error?.message);
            }
        }
    },
    Mutation: {
        createConversation: async (_, args, context) => {
            const { session, prisma, pubsub } = context;
            const { participantIds } = args;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not authorized");
            }
            const { user: { id: userId }, } = session;
            try {
                const conversation = await prisma.conversation.create({
                    data: {
                        participants: {
                            createMany: {
                                data: participantIds.map(id => ({
                                    userId: id,
                                    hasSeenLatestMessage: id === userId
                                }))
                            }
                        }
                    },
                    include: exports.conversationPopulated,
                });
                //emit a CONVERSATION_CREATED event using pubsub
                pubsub.publish('CONVERSATION_CREATED', {
                    conversationCreated: conversation,
                });
                return {
                    conversationId: conversation.id,
                };
            }
            catch (error) {
                console.log("createConversation error", error);
                throw new graphql_1.GraphQLError("Error creating conversation");
            }
        },
    },
    Subscription: {
        conversationCreated: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, context) => {
                const { pubsub } = context;
                return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
            }, (payload, _, context) => {
                const { session } = context;
                const { conversationCreated: { participants }, } = payload;
                const userIsParticipant = !!participants.find((p) => p.userId === session?.user?.id);
                return userIsParticipant;
            }),
        },
    }
};
exports.participantPopulated = client_1.Prisma.validator()({
    user: {
        select: {
            id: true,
            username: true,
        }
    }
});
exports.conversationPopulated = client_1.Prisma.validator()({
    participants: {
        include: exports.participantPopulated,
    },
    latestMessage: {
        include: {
            sender: {
                select: {
                    id: true,
                    username: true,
                }
            }
        }
    }
});
exports.default = resolvers;
//# sourceMappingURL=conversation.js.map