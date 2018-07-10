const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const jwksClient = require('jwks-rsa');
const jwtParser = require('jsonwebtoken');
const AuthTokenStrategy = require('passport-auth-token');
const fs = require('fs');
const path = require('path');

module.exports = function (app) {
  const config = app.get('authentication');

  const keyProvider = jwksClient({
    cache: true,
    rateLimit: true,
    jwksUri: `${config.hosts.login}${config.jwks_endpoint}`
  });

  // Set up authentication with the secret
  app.configure(authentication({
    secret: config.secret,
    strategies: ['jwt', 'token'],
    path: '/authentication',
    session: false,
    jwt: {
      header: { typ: 'JWT' },
      audience: config.hosts.api,
      issuer: config.hosts.api
    }
  }));

  // Set up jwt verification
  app.configure(jwt({
    audience: config.hosts.api,
    issuer: [config.hosts.login, config.hosts.api],
    algorithm: ['RS256', 'HS256'],
    secretOrKey: null,
    secretOrKeyProvider: function secretOrKeyProvider(req, token, done){
      var decoded = jwtParser.decode(token, { complete: true });

      // no kid, fallback to HS256 local secret
      if (!decoded.header.kid)
        return done(null, config.secret);

      keyProvider.getSigningKey(decoded.header.kid, (err, key) => {
        if (err) return done(err);

        done(null, key.publicKey || key.rsaPublicKey);
      });
    }
  }));

  // Set up internal token authentication
  app.passport.use('token', new AuthTokenStrategy(
    function authTokenVerifier(token, done) {
      fs.readFile(path.join(__dirname, '../config/tokenstore.json'), 'utf8', function(err, data) {
        if (err) return done(err);

        try {
          var tokens = JSON.parse(data);
        } catch(err) {
          return done(err);
        }

        if (tokens.find(x => x == token))
          return done(null, {});
        done(null, false, { message: 'Invalid auth token' });
      });
    }
  ));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(['jwt', 'token']),

        // Prevent jwt to be regenerated
        function keepJWT(context) {
          if (context.data.strategy === 'jwt') {
            context.result = context.result || {};
            context.result.accessToken = context.data.accessToken;
          }
          return context;
        }
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
