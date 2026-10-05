import  merge  from "lodash/merge.js"
import { usersResolvers } from "./users.resolver.ts"
import { categoryResolver } from "./category.resolver.ts"
import { productResolver } from "./product.resolver.ts";

export const resolvers = merge({}, usersResolvers, categoryResolver,productResolver);