
export const productsTypeDefs = `#graphql

type UploadSignature {
  signature: String!
  timestamp: Int!
  cloudName: String!
  apiKey: String!
  folder: String!
}

type Image{
    url:String!
    public_id:String!
}

type Product{
    id:ID!
    name:String!
    description:String!
    price:Float!
    image: Image!
    category:Category!
    size:[String!]!
    colors:[String!]!
    countInStock:Int!
    isFeatured:Boolean!
    createdAt:String!
    updatedAt:String!
}

type ProductsPage{
    items:[Product!]!
    totalCount:Int!
    page:Int!
    totalPages:Int!
}


type Query{
    product(id:ID!):Product!
    products(search:String, page:Int=1, limit:Int=10):ProductsPage!
    featuredProducts(limit:Int=8):[Product!]!
    popularProducts(limit:Int=8):[Product!]!
    uploadSignature: UploadSignature!
}

type Mutation{
    createProduct(input:CreateProductInput!):Product!
    deleteProduct(id:ID!):Boolean!
}

input CreateProductInput{
    name:String!
    description:String!
    price:Float!
    imagePublicId: String!
    categoryId:ID!
    size:[String!]!
    colors:[String!]!
    countInStock:Int!
    isFeatured:Boolean!
}


`