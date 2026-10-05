export const categoriesTypeDes = `#graphql

type Category{
    id:ID!
    name:String!
    author:User!
}

type Query{
    categories:[Category!]!
    category(id:ID!):Category!
}

type Mutation{
    createCategory(name:String!):Category!
}

`;