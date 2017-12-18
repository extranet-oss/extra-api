const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const AuthTokenStrategy = require('passport-auth-token').Strategy;
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const session = require('express-session');
const querystring = require('querystring');


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
      if (config.token.validTokens.find(x => x == token)) {
        // todo: add godmode user
        done(null, {});
      }

      done(null, false);
    }
  ));

  app.passport.use('azuread', new OIDCStrategy(config.azuread,
    function(iss, sub, profile, accessToken, refreshToken, done) {
      if (!profile.oid) {
        return done(new Error("No oid found"), null);
      }

      // Todo : login user from upn
      done(null, {});
    }
  ));

  const sessionMiddleware = session({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
  });

  app.get('/auth/azuread',
    sessionMiddleware,
    (req, res, next) => {
      // register redirect_uri in session
      let redirect_uri;
      if (req.query.hasOwnProperty("redirect_uri") && config.azuread.returnURLs.find(x => x==req.query.redirect_uri))
        redirect_uri = req.query.redirect_uri;
      else
        redirect_uri = config.azuread.returnURLs[0];

      req.session.azuread_failureRedirect = `${redirect_uri}?success=false`;
      req.session.azuread_successRedirect = `${redirect_uri}?success=true`;

      authentication.express.authenticate('azuread', {
        failureRedirect: req.session.azuread_failureRedirect,
        session:false
      })(req, res, next);
    }
  );

  app.get('/auth/azuread/callback',
    sessionMiddleware,
    (req, res, next) => {
      if (!req.session.hasOwnProperty("azuread_failureRedirect") || !req.session.hasOwnProperty("azuread_successRedirect"))
        res.redirect(`${config.azuread.returnURLs[0]}?success=false`);

      authentication.express.authenticate('azuread', {
        failureRedirect: req.session.azuread_failureRedirect,
        session:false
      })(req, res, next);
    },
    function(req, res) {
      const data = {};
      const params = {};

      // Todo : passing the right payload to authenticate service
      app.service(config.path).create(data, params).then(result => {
        res.data = result;

        // Todo : setting success callback or something
        res.redirect(`${req.session.azuread_successRedirect}&${querystring.stringify(result)}`);
      }).catch(() => {

        // Todo : setting error callback or something
        res.redirect(req.session.azuread_failureRedirect);
      });
    }
  );

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service(config.path).hooks({
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
