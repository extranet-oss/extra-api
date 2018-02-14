const AuthTokenStrategy = require('passport-auth-token').Strategy;


module.exports = function () {
  const app = this;
  const config = app.get('authentication');

  // Setup token auth -> used for internal purposes
  app.passport.use('token', new AuthTokenStrategy(
    function (token, done) {
      // todo: token storage
      if (config.token.validTokens.find(x => x == token))
        done(null, 'god');
      else
        done(null, false);
    }
  ));
};
