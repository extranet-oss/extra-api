const authentication = require('@feathersjs/authentication');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const endpoints = require('./endpoints.js');

module.exports = function (middlewares) {

  return (app) => {
    const config = app.get('azuread');

    // Set up Azure Active Directory Strategy
    app.passport.use(new OIDCStrategy(config,
      (iss, sub, profile, accessToken, refreshToken, done) => {

        if (!profile.oid || !profile.upn) {
          return done(null, false, 'Invalid azuread account.');
        }

        const users = app.service('users');

        users.find({
          query: {
            intra_id: profile.upn
          }
        })
        .then(matches => {
          if (matches.total == 0)
            done(null, false, 'Your account is not yet registered on the intranet.')
          else
            done(null, matches.data[0])
        })
        .catch(err => done(err));
      }
    ));


    // register azuread login endpoints
    endpoints(app, middlewares);
  }
};
