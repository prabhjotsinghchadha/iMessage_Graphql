import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date
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

export default typeDefs;
