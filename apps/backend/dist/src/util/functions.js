"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAndCreateUsername = exports.userIsConversationParticipant = void 0;
function userIsConversationParticipant(participants, userId) {
    return !!participants.find((participant) => participant.userId === userId);
}
exports.userIsConversationParticipant = userIsConversationParticipant;
async function verifyAndCreateUsername(args, prisma) {
    const { userId, username } = args;
    try {
        /**
         * Check if username taken by another user
         */
        const existingUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (existingUser) {
            return {
                error: "Username already taken. Try another",
            };
        }
        /**
         * update username
         */
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                username,
            },
        });
        return { success: true };
    }
    catch (error) {
        console.log("createUsername error", error);
        return {
            error: error?.message,
        };
    }
}
exports.verifyAndCreateUsername = verifyAndCreateUsername;
//# sourceMappingURL=functions.js.map