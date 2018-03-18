const authentication = require('@feathersjs/authentication');
const errors = require('@feathersjs/errors');

module.exports = function (app, middlewares) {
  const config = app.get('azuread');

  // Auth endpoint: redirects user to azuread
  app.get(config.endpoints.auth,
    middlewares,

    // inject next url into session
    (req, res, next) => {
      if (!req.query.hasOwnProperty('next'))
        throw new errors.BadRequest('missing required "next" parameter');
      req.session.next = req.query.next;

      next();
    },

    // start azuread authentication flow
    authentication.express.authenticate('azuread-openidconnect', {
      session: false
    }),

    // catch any error and flash it since feathers override doesn't support for flashes
    (err, req, res, next) => {
      // don't redirect if no session
      if (!req.session || !req.session.next)
        next(err);

      req.flash('error', err.message);
      res.redirect(req.session.next);
    }
  );


  // Callback endpoint: user returns from azuread
  app.get(config.endpoints.callback,
    middlewares,

    // ensure we have a next url
    (req, res, next) => {
      if (!req.session.hasOwnProperty('next'))
        throw new errors.BadRequest('missing required "next" parameter');

      next();
    },

    // finish azuread authentication flow
    authentication.express.authenticate('azuread-openidconnect', {
      session: false
    }),

    // we have a success, login user in session
    (req, res) => {
      req.session.user = req.user.id;
      res.redirect(req.session.next);
    },

    // catch any error and flash it since feathers override doesn't support for flashes
    (err, req, res, next) => {
      // ignore badrequest thrown by upper middleware
      if (!req.session || !req.session.next)
        next(err);

      req.flash('error', err.message);
      res.redirect(req.session.next);
    }
  );
};