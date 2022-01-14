const express = require('express');

// import ApolloServer
const { ApolloServer } = require('apollo-server-express');
// import our typeDefs and resolvers
//const { typeDefs, resolvers } = require('./schemas');

const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// lol silly me i forgot to run the react 'server' with `npm start` from the ./client
// directory.  I must be new to this or something.  
// gotta say great problem solving by just building the project and switching environmetns
// what a can do attitude .... fake it till you make it!

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});