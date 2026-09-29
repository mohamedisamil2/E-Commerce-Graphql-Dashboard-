
export const usersTypeDefs = `#graphql

enum Role{
    admin
    user
}

type AuthPayload{
    accessToken:String!
    user:User!
}

type RefreshPayload{
    accessToken: String!
}

type User{
    id:ID!
    name:String!
    email:String!
    role:Role!
    createdAt:String!
}

type Query{
    users:[User]
    user(id:ID!):User!
    me:User
}

type Mutation{
    registerUser(input:RegiserInput!):AuthPayload!
    login(email:String!, password:String!):AuthPayload!
    logout:Boolean!
    refreshToken:RefreshPayload!
}

input RegiserInput{
    name:String!
    email:String!
    password:String!
}


`