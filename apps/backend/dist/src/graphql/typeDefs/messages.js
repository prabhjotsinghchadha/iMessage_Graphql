"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
const typeDefs = (0, graphql_tag_1.default) `
  scalar Date

  type Message {
    id: String
    sender: User
    body: String
    createdAt: Date
  }

  type Query {
    messages( conversationId: String): [Message]
    }

  type Mutation {
    sendMessage(
      id: String
      conversationId: String
      senderId: String
      body: String
    ): Boolean
  }

  type Subscription {
    messageSent(conversationId: String): Message
  }
`;
exports.default = typeDefs;
//# sourceMappingURL=messages.js.map