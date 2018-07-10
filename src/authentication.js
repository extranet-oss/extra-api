const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const jwksClient = require('jwks-rsa');
const jwtParser = require('jsonwebtoken');

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
    strategies: ['jwt'],
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

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(['jwt']),

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
