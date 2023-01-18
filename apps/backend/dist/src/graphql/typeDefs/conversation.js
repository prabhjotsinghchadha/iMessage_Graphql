"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
const typeDefs = (0, graphql_tag_1.default) `
  scalar Date

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
  }

  type CreateConversationResponse {
    conversationId: String
    }

  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date 
    updatedAt: Date
    }

    type Participant {
      id: String
      user: User
      hasSeenLatestMessage: Boolean
      }

  type Query {
    conversations: [Conversation]
    }

  type Subscription {
    conversationCreated: Conversation
    }
`;
exports.default = typeDefs;
//# sourceMappingURL=conversation.js.map