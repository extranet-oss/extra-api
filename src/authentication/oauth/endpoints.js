const authentication = require('@feathersjs/authentication');
const errors = require('@feathersjs/errors');
const url = require('url');
const querystring = require('querystring');
const omit = require('lodash.omit');
const ConnectSequence = require('connect-sequence')

module.exports = function (app, server, middlewares) {
  const config = app.get('oauth');

  const decisionMiddleware = server.decision((req, done) => {
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
        next_url = `${next_parsed.pathname}?${querystring.stringify(omit(next_parsed.query, ['bypass']))}`

      var azuread = app.get('azuread').endpoints.auth;
      req.azuread_url = `${azuread}?next=${encodeURIComponent(next_url)}`;

      if (!req.isAuthenticated || !req.isAuthenticated()) {

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
    server.authorize((clientID, redirectURI, done) => {
      const clients = app.service('oauth/clients');

      clients.get(clientID)
        .then((data) => {
          if (data.redirect_uris.indexOf(redirectURI) == -1) { return done(null, false); }

          return done(null, data, redirectURI);
        })
        .catch((err) => {
          done(err);
        });
    }),

    // Show authorize dialog
    (req, res, next) => {
      // special case for trusted clients, we automatically authorize the request
      if (req.oauth2.client.trusted) {
        req.body.transaction_id = req.oauth2.transactionID;

        // Create a new middleware sequence processing decision
        var seq = new ConnectSequence(req, res, next)
        seq.appendList(decisionMiddleware);
        seq.run();
        return;
      }

      res.render('dialog', {
        transactionID: req.oauth2.transactionID,
        user: req.user,
        client: req.oauth2.client,
        scopes: req.oauth2.req.scope,
        oauth: config,
        error: req.flash('error'),
        azuread_url: req.azuread_url
      });
    }
  );


  // Authorize dialog answer endpoint
  app.post(config.endpoints.decision,
    middlewares,

    // Login user from session
    authentication.express.authenticate('session'),

    // Check if user is logged in, if not, error
    (req, res, next) => {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        throw new errors.NotAuthenticated();
      }
      next();
    },

    // Finalize authorization
    decisionMiddleware
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
