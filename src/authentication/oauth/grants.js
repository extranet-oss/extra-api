const oauth2orize = require('oauth2orize');

module.exports = function (app, server) {

  // Setup authorization_code grant
  server.grant(oauth2orize.grant.code((client, redirectURI, user, ares, areq, done) => {

    const authorization_codes = app.service('oauth/authorization-codes');

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
};
