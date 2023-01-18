"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagePopulated = void 0;
const client_1 = require("@prisma/client");
const graphql_1 = require("graphql");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const functions_1 = require("../../util/functions");
const conversation_1 = require("./conversation");
const resolvers = {
    Query: {
        messages: async function (_, args, context) {
            const { session, prisma } = context;
            const { conversationId } = args;
            if (!session?.user) {
                throw new graphql_1.GraphQLError('Not Authorized');
            }
            const { user: { id: userId }, } = session;
            /**
             * Verify that conversation exists & user is a participant
             */
            const conversation = await prisma.conversation.findUnique({
                where: {
                    id: conversationId,
                },
                include: conversation_1.conversationPopulated
            });
            if (!conversation) {
                throw new graphql_1.GraphQLError("Conversation Not Found");
            }
            const allowedToView = (0, functions_1.userIsConversationParticipant)(conversation.participants, userId);
            if (!allowedToView) {
                throw new graphql_1.GraphQLError("Not Authorized");
            }
            try {
                const messages = await prisma.message.findMany({
                    where: {
                        conversationId
                    },
                    include: exports.messagePopulated,
                    orderBy: {
                        createdAt: "desc",
                    }
                });
                return messages;
            }
            catch (error) {
                console.log('messages error', error);
                throw new graphql_1.GraphQLError(error?.message);
            }
        }
    },
    Mutation: {
        sendMessage: async function (_, args, context) {
            const { session, prisma, pubsub } = context;
            const { id: messageId, senderId, conversationId, body } = args;
            if (!session?.user) {
                throw new graphql_1.GraphQLError('Not Authorized');
            }
            const { id: userId } = session.user;
            if (userId !== senderId) {
                throw new graphql_1.GraphQLError('Not Authorized');
            }
            try {
                /**
                 * Create new message entity
                 */
                const newMessage = await prisma.message.create({
                    data: {
                        id: messageId,
                        senderId,
                        conversationId,
                        body,
                    },
                    include: exports.messagePopulated
                });
                /**
                 * Find ConversationParticipant entity
                 */
                const participant = await prisma.conversationParticipant.findFirst({
                    where: {
                        userId,
                        conversationId
                    }
                });
                if (!participant) {
                    throw new graphql_1.GraphQLError("participant does not exist");
                }
                /**
                 * Update conversation entity
                 */
                const conversation = await prisma.conversation.update({
                    where: {
                        id: conversationId,
                    },
                    data: {
                        latestMessageId: newMessage.id,
                        participants: {
                            update: {
                                where: {
                                    id: participant.id,
                                },
                                data: {
                                    hasSeenLatestMessage: true,
                                },
                            },
                            updateMany: {
                                where: {
                                    NOT: {
                                        userId,
                                    },
                                },
                                data: {
                                    hasSeenLatestMessage: false,
                                }
                            }
                        },
                    },
                    include: conversation_1.conversationPopulated,
                });
                console.log(conversation);
                pubsub.publish('MESSAGE_SENT', { messageSent: newMessage });
                //  pubsub.publish('CONVERSATION_UPDATED', {
                //    conversationUpdated: {
                //      conversation,
                //    }
                //  })
            }
            catch (error) {
                console.log('sendMessage error', error);
                throw new graphql_1.GraphQLError('Error sending message');
            }
            return true;
        }
    },
    Subscription: {
        messageSent: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((_, __, context) => {
                const { pubsub } = context;
                return pubsub.asyncIterator(["MESSAGE_SENT"]);
            }, (payload, args) => {
                return payload.messageSent.conversationId === args.conversationId;
            }),
        },
    }
};
exports.messagePopulated = client_1.Prisma.validator()({
    sender: {
        select: {
            id: true,
            username: true,
        }
    }
});
exports.default = resolvers;
//# sourceMappingURL=message.js.map