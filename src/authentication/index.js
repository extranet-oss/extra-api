const authentication = require('@feathersjs/authentication');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const merge = require('lodash.merge');
const flash = require('connect-flash');
const { disallow } = require('feathers-hooks-common');
const jwt = require('./jwt.js');
const azuread = require('./azuread');
const oauth = require('./oauth');


module.exports = function (app) {
  const authConfig = app.get('authentication');
  const sessionConfig = app.get('session');

  // Set up middlewares used on authorization pages
  const middlewares = [
    cookieParser(sessionConfig.secret),
    session(merge(sessionConfig, {
      store: new RedisStore(sessionConfig.store.redis)
    })),
    flash()
  ];

  // Set up authentication with the secret
  app.configure(authentication(authConfig));

  // Set up authentication strategies
  app.configure(jwt);
  app.configure(azuread(middlewares));
  app.configure(oauth(middlewares));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service(authConfig.path).hooks({
    before: {
      all: [ disallow('external') ]
    }
  });
};
