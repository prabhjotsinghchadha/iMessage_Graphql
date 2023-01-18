"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const schema_1 = require("@graphql-tools/schema");
const client_1 = require("@prisma/client");
// import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
// import { ApolloServer } from "apollo-server-express";
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
const express_1 = tslib_1.__importDefault(require("express"));
const graphql_subscriptions_1 = require("graphql-subscriptions");
const ws_1 = require("graphql-ws/lib/use/ws");
const http_1 = require("http");
const ws_2 = require("ws");
const react_1 = require("next-auth/react");
const resolvers_1 = tslib_1.__importDefault(require("./graphql/resolvers"));
const typeDefs_1 = tslib_1.__importDefault(require("./graphql/typeDefs"));
const dotenv = tslib_1.__importStar(require("dotenv"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const main = async () => {
    dotenv.config();
    // Create the schema, which will be used separately by ApolloServer and
    // the WebSocket server.
    const schema = (0, schema_1.makeExecutableSchema)({
        typeDefs: typeDefs_1.default,
        resolvers: resolvers_1.default,
    });
    // Create an Express app and HTTP server; we will attach both the WebSocket
    // server and the ApolloServer to this HTTP server.
    const app = (0, express_1.default)();
    const httpServer = (0, http_1.createServer)(app);
    // Create our WebSocket server using the HTTP server we just set up.
    const wsServer = new ws_2.WebSocketServer({
        server: httpServer,
        path: "/graphql/subscriptions",
    });
    // Context parameters
    const prisma = new client_1.PrismaClient();
    const pubsub = new graphql_subscriptions_1.PubSub();
    const getSubscriptionContext = async (ctx) => {
        ctx;
        // ctx is the graphql-ws Context where connectionParams live
        if (ctx.connectionParams && ctx.connectionParams.session) {
            const { session } = ctx.connectionParams;
            return { session, prisma, pubsub };
        }
        // Otherwise let our resolvers know we don't have a current user
        return { session: null, prisma, pubsub };
    };
    // Save the returned server's info so we can shutdown this server later
    const serverCleanup = (0, ws_1.useServer)({
        schema,
        context: (ctx) => {
            // This will be run every time the client sends a subscription request
            // Returning an object will add that information to our
            // GraphQL context, which all of our resolvers have access to.
            return getSubscriptionContext(ctx);
        },
    }, wsServer);
    // Set up ApolloServer.
    const server = new server_1.ApolloServer({
        schema,
        csrfPrevention: true,
        plugins: [
            // Proper shutdown for the HTTP server.
            (0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            // Proper shutdown for the WebSocket server.
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
    });
    await server.start();
    const corsOptions = {
        origin: process.env.BASE_URL,
        credentials: true,
    };
    app.use("/graphql", (0, cors_1.default)(corsOptions), (0, body_parser_1.json)(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const session = await (0, react_1.getSession)({ req });
            return { session: session, prisma, pubsub };
        },
    }));
    // server.applyMiddleware({ app, path: "/graphql", cors: corsOptions });
    const PORT = process.env.PORT;
    // Now that our HTTP server is fully set up, we can listen to it.
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
};
main().catch((err) => console.log(err));
//# sourceMappingURL=index.js.map