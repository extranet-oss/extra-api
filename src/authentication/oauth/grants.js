const oauth2orize = require('oauth2orize');
const errors = require('@feathersjs/errors');
const gen_tokens = require('./gen_tokens.js');

module.exports = function (app, server) {

  // Setup authorization_code grant
  server.grant(oauth2orize.grant.code((client, redirectURI, user, ares, areq, done) => {

    const authorization_codes = app.service('oauth/authorization-codes');

    if (!areq.scope)
      return done(new errors.BadRequest('Missing required parameter: scope'));

    // create code according to request infos
    authorization_codes.create({
      client_id: client.id,
      redirect_uri: redirectURI,
      user_id: user.id,
      scopes: areq.scope
    })
      .then((data) => {
        done(null, data.id);
      })
      .catch((err) => {
        done(err);
      });
  }));

  // Setup token grant (implicit)
  server.grant(oauth2orize.grant.token((client, user, ares, areq, done) => {

    if (!areq.scope)
      return done(new errors.BadRequest('Missing required parameter: scope'));

    // Generate tokens
    gen_tokens(app, client, user, areq.scope, false, done);
  }));
};
