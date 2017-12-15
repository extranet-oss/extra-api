const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const AuthTokenStrategy = require('passport-auth-token').Strategy;



module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());

  // Setup token auth -> used for internal purposes
  app.passport.use('token', new AuthTokenStrategy(
    function (token, done) {
      // todo: token storage
      if (token == 'secret') {
        // todo: add godmode user
        done(null, {});
      }

      done(null, false);
    }
  ));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
