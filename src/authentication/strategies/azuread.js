const authentication = require('@feathersjs/authentication');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const querystring = require('querystring');

module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  app.passport.use('azuread', new OIDCStrategy(config.azuread,
    function(iss, sub, profile, accessToken, refreshToken, done) {

      if (!profile.oid || !profile.upn) {
        return done(null, false, { message: 'Invalid azuread account.' });
      }

      const users = app.service('users');

      users.find({
        query: {
          intra_id: profile.upn
        }
      })
      .then(matches => {
        if (matches.total == 0)
          done(null, false, { message: 'Your account is not yet registered on the intranet.' })
        else
          done(null, 'user', { userId: matches.data[0].id })
      })
      .catch(err => done(err));
    }
  ));

  const sessionMiddleware = session({
    store: new RedisStore(config.store.redis),
    secret: config.secret,
    resave: false,
    saveUninitialized: false
  });

  app.get('/auth/azuread',
    sessionMiddleware,
    (req, res, next) => {
      // register redirect_uri in session
      let redirect_uri;
      if (req.query.hasOwnProperty('redirect_uri') && config.azuread.returnURLs.find(x => x==req.query.redirect_uri))
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
      if (!req.session.hasOwnProperty('azuread_failureRedirect') || !req.session.hasOwnProperty('azuread_successRedirect'))
        res.redirect(`${config.azuread.returnURLs[0]}?success=false`);

      app.passport.authenticate('azuread', {
        session:false
      })(req)
      .then(result => {
        if (result.fail) res.redirect(`${req.session.azuread_failureRedirect}&${querystring.stringify(result.challenge)}`);

        console.log(result)
        app.service(config.path).create({}, result.data).then(result => {
          res.redirect(`${req.session.azuread_successRedirect}&${querystring.stringify(result)}`);
        }).catch(() => {
          res.redirect(req.session.azuread_failureRedirect);
        })
      })
    }
  );
};
