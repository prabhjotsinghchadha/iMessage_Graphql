"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const graphql_tag_1 = tslib_1.__importDefault(require("graphql-tag"));
const typeDefs = (0, graphql_tag_1.default) `
  scalar Date

  type User {
    id: String
    name: String 
    username: String 
    email: String 
    emailVerified: Boolean
    image: String
    }
  type SearchedUser {
    id: String
    username: String
  }
  type Query {
    searchUsers(username: String!): [SearchedUser]
  }
  type Mutation {
    createUsername(username: String!): CreateUsernameResponse
  }
  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`;
exports.default = typeDefs;
//# sourceMappingURL=users.js.map