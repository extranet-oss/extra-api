const oauth2orize = require('oauth2orize');
const errors = require('@feathersjs/errors');

module.exports = function (app, server) {
  const userProperty = app.get('authentication').entity;

  // Setup authorization_code grant exchange
  server.exchange(oauth2orize.exchange.code({ userProperty }, (client, code, redirectURI, done) => {

    const authorization_codes = app.service('oauth/authorization-codes');

    // Retrieve code metadata
    authorization_codes.get(code)
      .then((data) => {

        // Invalidate the code
        authorization_codes.remove(code);

        // Check if request is valid according to code metadata
        if (client.id !== data.client_id) { return done(null, false); }
        if (redirectURI !== data.redirect_uri) { return done(null, false); }

        // Create JWT
        app.service(app.get('authentication').path).create({}, {
          user: 'client',
          payload: {
            clientId: data.client_id,
            userId: data.user_id,
            scopes: data.scopes
          }
        }).then(result => {
          done(null, result.accessToken);
        })
          .catch((err) => {
            done(err);
          });

      })
      .catch((err) => {
        if (err instanceof errors.NotFound) return done(null, false);
        done(err);
      });
  }));

};
