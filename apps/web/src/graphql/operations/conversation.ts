import gql from "graphql-tag";

export default {
  Queries: {},
  Mutations: {
    createConversation: gql`
      mutation CreateConversation($participantIds: [String]!) {
        createConversation(participantIds: $participantIds) {
          conversationId
        }
      }
    `
  }
}

