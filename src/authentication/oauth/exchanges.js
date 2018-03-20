const oauth2orize = require('oauth2orize');
const errors = require('@feathersjs/errors');
const gen_tokens = require('./gen_tokens.js');

module.exports = function (app, server) {
  const userProperty = app.get('authentication').entity;

  // Setup authorization_code grant exchange
  server.exchange(oauth2orize.exchange.code({ userProperty }, (client, code, redirectURI, done) => {

    const authorization_codes = app.service('oauth/authorization-codes');
    const users = app.service('users');

    // Retrieve code metadata
    authorization_codes.get(code)
      .then((data) => {

        // Invalidate the code
        authorization_codes.remove(code);

        // Check if request is valid according to code metadata
        if (client.id !== data.client_id) { return done(null, false); }
        if (redirectURI !== data.redirect_uri) { return done(null, false); }

        // Get user data
        users.find({
          query: {
            id: data.user_id
          }
        })
        .then(matches => {
          if (matches.total == 0)
            return done(null, false);

          // Generate tokens
          gen_tokens(app, client, matches.data[0], data.scopes, true, done);
        })
        .catch(err => done(err));

      })
      .catch((err) => {
        if (err instanceof errors.NotFound) return done(null, false);
        done(err);
      });
  }));

};
