import { ConversationPopulated } from '../../../backend/src/util/types'
/*
 * Users 
* */
export interface CreateUseranameData {
  createUsername: {
    success: boolean;
    error: string;
  };
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUsersInput {
  username: string;
}

export interface SearchUsersData {
  searchUsers: Array<SearchedUser>
}

export interface SearchedUser {
  id: string;
  username: string;
}

/*
 * Conversation
* */

export interface ConversationsData {
  conversations: Array<ConversationPopulated>
}

export interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

export interface CreateConversationInputs {
  participantIds: Array<string>
}
