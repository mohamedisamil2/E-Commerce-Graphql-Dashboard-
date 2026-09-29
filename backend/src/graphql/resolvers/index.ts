import  merge  from "lodash/merge.js"
import { usersResolvers } from "./users.resolver.ts"

export const resolvers = merge({}, usersResolvers)