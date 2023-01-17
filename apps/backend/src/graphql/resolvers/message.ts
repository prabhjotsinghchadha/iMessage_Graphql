import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { GraphQLContext, MessagePopulated, SendMessageArguments, SendMessageSubscriptionPayload } from "../../util/types";
import { conversationPopulated } from "./conversation";

const resolvers = {
  Query: {
    messages: async function(
      _: any,
      args: { conversationId: string },
      context: GraphQLContext
    ): Promise<Array<MessagePopulated>> {

      const { session, prisma } = context;
      const { conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError('Not Authorized')
      }

      //  const { user: { id: userId }, } = session;

      /**
       * Verify that user is a participant
       */
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulated
      })

      if (!conversation) {
        throw new GraphQLError("Conversation Not Found");
      }

      return [];
    }

  },
  Mutation: {
    sendMessage: async function(
      _: any,
      args: SendMessageArguments,
      context: GraphQLContext
    ): Promise<boolean> {

      const { session, prisma, pubsub } = context;
      const { id: messageId, senderId, conversationId, body } = args;

      if (!session?.user) {
        throw new GraphQLError('Not Authorized')
      }

      const { id: userId } = session.user;

      if (userId !== senderId) {
        throw new GraphQLError('Not Authorized')
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
          include: messagePopulated
        })
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
                  id: senderId
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId: senderId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                }
              }
            },
          },
        });
        console.log(conversation)

        pubsub.publish('MESSAGE_SENT', { messageSent: newMessage });
        //  pubsub.publish('CONVERSATION_UPDATED', {
        //    conversationUpdated: {
        //      conversation,
        //    }
        //  })
      } catch (error) {
        console.log('sendMessage error', error);
        throw new GraphQLError('Error sending message');
      }
      return true;
    }
  },
  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(["MESSAGE_SENT"]);
        },
        (
          payload: SendMessageSubscriptionPayload,
          args: { conversationId: string },
        ) => {
          return payload.messageSent.conversationId === args.conversationId;
        }
      ),
    },
  }
};

export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
    }
  }
})

export default resolvers;
