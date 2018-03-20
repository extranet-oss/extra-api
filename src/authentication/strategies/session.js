/**
 * Module dependencies.
 */
var util = require('util')
  , Strategy = require('passport-strategy');


/**
 * `SessionStrategy` constructor.
 *
 * @api public
 */
function SessionStrategy(options, deserializeUser) {
  if (typeof options == 'function') {
    deserializeUser = options;
    options = undefined;
  }
  options = options || {};

  Strategy.call(this);
  this.name = 'session';
  this._deserializeUser = deserializeUser;
}

/**
 * Inherit from `Strategy`.
 */
util.inherits(SessionStrategy, Strategy);

/**
 * Authenticate request based on the current session state.
 *
 * The session authentication strategy uses the session to restore any login
 * state across requests.  If a login session has been established, `req.user`
 * will be populated with the current user.
 *
 * @param {Object} req
 * @param {Object} options
 * @api protected
 */
SessionStrategy.prototype.authenticate = function(req, options) {
  if (req.session === undefined) throw Error('session strategy requires sessions');
  options = options || {};

  var self = this,
    su;
  if (req.session) {
    su = req.session.user;
  }

  if (su || su === 0) {

    this._deserializeUser(su, function(err, user, info) {
      if (err) { return self.error(err); }
      if (!user) {
        delete req.session.user;
        self.pass();
      } else {
        self.success(user, info);
      }
    });
  } else {
    self.pass();
  }
};


/**
 * Expose `SessionStrategy`.
 */
module.exports = SessionStrategy;
