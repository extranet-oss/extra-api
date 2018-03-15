const authentication = require('@feathersjs/authentication');
const errors = require('@feathersjs/errors');

module.exports = function (app, server, middlewares) {
  const config = app.get('oauth');

  // Authorize dialog endpoint
  app.get(config.endpoints.authorize,
    middlewares,

    // Login user from session
    authentication.express.authenticate('session'),

    // Check if user is logged in, if not, show login screen
    (req, res, next) => {
      var azuread = app.get('azuread').endpoints.auth;
      req.azuread_url = `${azuread}?next=${encodeURIComponent(req.url)}`;

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
    (req, res) => {
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
    server.decision((req, done) => {
      // scopes can be modified here
      return done(null, {});
    })
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
