const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// must build from the client directory and set the this ENV variable
// or the site will produce errors as it only returns the routes it knows or index.html
// the client/public directory is not the same structure as the build directory
// this causes calls for manifest.json and javascripts/css etc to all return index.html
process.env.NODE_ENV = 'production';

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});