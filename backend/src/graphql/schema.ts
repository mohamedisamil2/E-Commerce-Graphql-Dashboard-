import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./typeDefs/index.ts";
import { resolvers } from "./resolvers/index.ts";

export const schema = makeExecutableSchema({ typeDefs, resolvers });