const { authenticate } = require('@feathersjs/authentication').hooks;
const errors = require('feathers-errors');

module.exports = function (type = 'both') {
  if (type != 'user' && type != 'client' && type != 'both') {
    throw new Error(`Invalid entity type passed to 'authenticate' hook. (use user/client/both)`);
  }

  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'authenticate' hook should only be used as a 'before' hook.`);
    }

    return new Promise((resolve, reject) => {
      authenticate('jwt')(hook)
      .then(hook => {

        if (!hook.params.provider) {
          resolve(hook);
        }

        if (!hook.params.auth) {
          throw new errors.NotAuthenticated(`The auth info is missing. You must not be authenticated.`);
        }

        if ((type == 'user' || type == 'both') && !hook.params.auth.user) {
          throw new errors.NotAuthenticated(`User is not authenticated.`);
        }

        if ((type == 'client' || type == 'both') && (!hook.params.auth.client || hook.params.auth.user)) {
          throw new errors.NotAuthenticated(`Client is not authenticated.`);
        }

        resolve(hook);
      })
      .catch(err => reject(err))
    })
  }
}
