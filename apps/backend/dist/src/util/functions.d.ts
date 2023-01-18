import { PrismaClient } from "@prisma/client";
import { CreateUsernameResponse, ParticipantPopulated } from "./types";
export declare function userIsConversationParticipant(participants: Array<ParticipantPopulated>, userId: string): boolean;
export declare function verifyAndCreateUsername(args: {
    userId: string;
    username: string;
}, prisma: PrismaClient): Promise<CreateUsernameResponse>;
