import express from "express";
import { ApolloServer } from "@apollo/server";
import cookieParser from "cookie-parser";
import cors from "cors";




export async function createApp() {
    
    const app = express();
   const typeDefs = `#graphql
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "Server is working!",
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

    await apolloServer.start();
    app.use(cookieParser());
    app.use(
        '/graphql',
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        }),
        express.json(),
    );

    return app;
    

}