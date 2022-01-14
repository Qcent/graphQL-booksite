// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql `
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

type Auth {
    token: ID!
    user: User
  }

type Book {
    bookId: ID
    title: String
    authours: [String]
    description: String
    image: String
    link: String
  }

type Query {
    me: User
  }

input BookInput {
  bookId: ID
  title: String
  authours: [String]
  description: String
  image: String
  link: String
  }

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook( bookId: ID!): User
  }
`;

// export the typeDefs
module.exports = typeDefs;