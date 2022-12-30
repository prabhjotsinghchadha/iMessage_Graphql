import { PrismaClient } from "@prisma/client";
import { Context } from "graphql-ws/lib/server";
import { ISODateString } from "next-auth";

/**
 * Server Configuration
 */
export interface Session {
  user?: User;
  expires: ISODateString;
}

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

/**
 * Users
 */
export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  image: string;
  name: string;
}

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}
