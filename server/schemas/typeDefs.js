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
    bookId: String
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }

type Query {
    me: User
  }

input BookInput {
  bookId: String
  title: String
  authors: [String]
  description: String
  image: String
  link: String
  }

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput): User
    removeBook( bookId: String!): User
  }
`;

// export the typeDefs
module.exports = typeDefs;