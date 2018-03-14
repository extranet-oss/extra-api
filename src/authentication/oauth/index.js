const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const oauth2orize = require('oauth2orize');
const sessionStrategy = require('../strategies/session.js');
const grants = require('./grants.js');
const exchanges = require('./exchanges.js');
const endpoints = require('./endpoints.js');

module.exports = function (middlewares) {

  return (app) => {
    const config = app.get('oauth');

    // Set up client password strategy used on token endpoint
    app.passport.use(new ClientPasswordStrategy((clientId, clientSecret, done) => {
      const clients = app.service('oauth/clients');

      clients.find({
        query: {
          id: clientId,
          secret: clientSecret
        }
      })
      .then(matches => {
        if (matches.total == 0)
          done(null, false);
        else
          done(null, matches.data[0]);
      })
      .catch(err => done(err));
    }));


    // Set up session strategy used to login user on authorization pages
    app.passport.use(new sessionStrategy((id, done) => {
      const users = app.service('users');

      users.find({
        query: {
          id: id
        }
      })
      .then(matches => {
        if (matches.total == 0)
          done(null, false);
        else
          done(null, matches.data[0]);
      })
      .catch(err => done(err));
    }))


    // Create oauth2 server
    var server = oauth2orize.createServer();

    // Set up oauth2 server
    server.serializeClient((client, done) => {
      return done(null, client.id);
    });

    server.deserializeClient((id, done) => {
      const clients = app.service('oauth/clients');

      clients.find({
        query: {
          id: id
        }
      })
      .then(matches => {
        if (matches.total == 0)
          done(null, false);
        else
          done(null, matches.data[0]);
      })
      .catch(err => done(err));
    });

    grants(app, server);
    exchanges(app, server);


    // register oauth2 server endpoints
    endpoints(app, server, middlewares);
  }
};
