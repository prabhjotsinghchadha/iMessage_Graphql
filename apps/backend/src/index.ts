import { ApolloServer } from "@apollo/server";
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from "express";
import * as dotenv from "dotenv";
import { PubSub } from "graphql-subscriptions";
import { PrismaClient } from "@prisma/client"
import cors from "cors";
import { json } from "body-parser";
import { GraphQLContext, Session, SubscriptionContext } from "./util/types";
import { getSession } from "next-auth/react";
import { expressMiddleware } from "@apollo/server/express4";

const main = async () => {
  dotenv.config();

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  // ...

  const app = express();
  // This `app` is the returned value from `express()`.
  const httpServer = createServer(app);
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql/subscriptions',
  });

  //Context parameter 
  const prisma = new PrismaClient();
  const pubsub = new PubSub();

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

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

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = await getSession({ req });

        return { session: session as Session, prisma, pubsub };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`Server ready at http://localhost:4000/graphql`);
}

main().catch((err) => console.log(err));
