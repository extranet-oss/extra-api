const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const token = require('./strategies/token.js');
const azuread = require('./strategies/azuread.js');


module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(token);
  app.configure(azuread);

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service(config.path).hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        (hook) => {
          hook.params.jwt = Object.assign({ subject: hook.params.user }, hook.params.jwt);
        }
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
