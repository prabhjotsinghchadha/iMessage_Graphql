"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const resolvers = {
    Query: {
        searchUsers: async (_, args, context) => {
            const { username: searchedUsername } = args;
            const { session, prisma } = context;
            if (!session?.user) {
                throw new graphql_1.GraphQLError("Not Authorized");
            }
            const { user: { username: myUsername }, } = session;
            try {
                const users = await prisma.user.findMany({
                    where: {
                        username: {
                            contains: searchedUsername,
                            not: myUsername,
                            mode: 'insensitive'
                        },
                    },
                });
                return users;
            }
            catch (error) {
                console.log("searchUsers error", error);
                throw new graphql_1.GraphQLError(error?.message);
            }
        },
    },
    Mutation: {
        createUsername: async (_, args, context) => {
            const { username } = args;
            const { session, prisma } = context;
            if (!session?.user) {
                return {
                    error: "Not authorized",
                };
            }
            const { id: userId } = session.user;
            try {
                /**
                 * Check if username taken by another user
                 */
                const existingUser = await prisma.user.findUnique({
                    where: {
                        username
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
        },
    },
};
exports.default = resolvers;
//# sourceMappingURL=user.js.map