const authentication = require('@feathersjs/authentication');
const errors = require('@feathersjs/errors');
const url = require('url');
const querystring = require('querystring');
const omit = require('lodash.omit');
const difference = require('lodash/difference');
const ConnectSequence = require('connect-sequence');
const { AuthorizationError } = require('oauth2orize');

module.exports = function (app, server, middlewares) {
  const config = app.get('oauth');
  const userProperty = app.get('authentication').entity;

  const decisionMiddleware = server.decision({ userProperty }, (req, done) => {
    // scopes can be modified here
    return done(null, {});
  });

  // Authorize dialog endpoint
  app.get(config.endpoints.authorize,
    middlewares,

    // Login user from session
    authentication.express.authenticate('session'),

    // Check if user is logged in, if not, show login screen
    (req, res, next) => {
      var next_parsed = url.parse(req.url, true),
        next_url = `${next_parsed.pathname}?${querystring.stringify(omit(next_parsed.query, ['bypass']))}`;

      var azuread = app.get('azuread').endpoints.auth;
      req.azuread_url = `${azuread}?next=${encodeURIComponent(next_url)}`;

      if (!req.authenticated) {

        // login prompt can be bypassed with query parameter
        if (req.query.bypass)
          res.redirect(req.azuread_url);

        return res.render('azuread', {
          azuread_url: req.azuread_url,
          error: req.flash('error')
        });
      }
      next();
    },

    // Start authorize process, we need to verify if client is valid
    server.authorize({ userProperty }, (clientID, redirectURI, done) => {
      const clients = app.service('oauth/clients');

      clients.find({
        query: {
          id: clientID
        }
      })
        .then(matches => {
          if (matches.total == 0)
            return done(null, false);

          if (matches.data[0].redirect_uris.indexOf(redirectURI) == -1)
            return done(new errors.BadRequest('Invalid redirect URI'));

          return done(null, matches.data[0], redirectURI);
        })
        .catch((err) => {
          done(err);
        });
    }),

    // Show authorize dialog
    (req, res, next) => {
      const authorizations = app.service('oauth/authorizations');

      // Check required user permissions
      if (difference(req.oauth2.client.required_permissions, req.oauth2.user.permissions).length > 0)
        throw new errors.Forbidden('You do not have permission to use this app');

      // special case where we automatically authorize the request
      // - if the client is trusted
      // - if the client has already been authorized, and has the same scopes
      authorizations.find({
        query: {
          user_id: req.oauth2.user.id,
          client_id: req.oauth2.client.id
        }
      }).then((matches) => {
        // Check if new scopes were requested
        var pass = false,
          scopes = req.oauth2.req.scope;
        if (matches.total != 0) {
          scopes = difference(req.oauth2.req.scope, matches.data[0].scopes);
          pass = scopes.length == 0;
        }

        if (pass || req.oauth2.client.trusted) {
          req.body.transaction_id = req.oauth2.transactionID;

          // Create a new middleware sequence processing decision
          var seq = new ConnectSequence(req, res, next);
          seq.appendList(decisionMiddleware);
          seq.run();
          return;
        }

        res.render('dialog', {
          transactionID: req.oauth2.transactionID,
          user: req.oauth2.user,
          client: req.oauth2.client,
          scopes: scopes,
          already_authorized: matches.total != 0,
          oauth: config,
          error: req.flash('error'),
          azuread_url: req.azuread_url
        });
      })
        .catch(err => next(err));
    },

    // Custom error handler to convert oauth2orize error back to feathers errors
    (err, req, res, next) => {
      if (err instanceof AuthorizationError) {
        err = new errors[err.status](err);
      }
      next(err);
    }
  );


  // Authorize dialog answer endpoint
  app.post(config.endpoints.decision,
    middlewares,

    // Login user from session
    authentication.express.authenticate('session'),

    // Check if user is logged in, if not, error
    (req, res, next) => {
      if (!req.authenticated) {
        throw new errors.NotAuthenticated();
      }
      next();
    },

    // Finalize authorization
    decisionMiddleware,

    // Custom error handler to convert oauth2orize error back to feathers errors
    (err, req, res, next) => {
      if (err instanceof AuthorizationError) {
        err = new errors[err.status](err);
      }
      next(err);
    }
  );


  // Token request endpoint
  app.post(config.endpoints.token,

    // authenticate client
    authentication.express.authenticate(['oauth2-client-password'], { session: false }),

    // generate token
    server.token(),
    server.errorHandler()
  );
};
