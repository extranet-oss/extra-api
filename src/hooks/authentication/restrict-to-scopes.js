const errors = require('feathers-errors');

module.exports = function (scopes = []) {
  if (!scopes || !scopes.length) {
    throw new Error(`You need to provide an array of 'scopes' to check against.`);
  }

  return function (hook) {
    if (hook.type !== 'before') {
      throw new Error(`The 'restrictToScopes' hook should only be used as a 'before' hook.`);
    }

    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    if (!hook.params.auth) {
      // TODO (EK): Add a debugger call to remind the dev to check their hook chain
      // as they probably don't have the right hooks in the right order.
      throw new errors.NotAuthenticated();
    }

    // Iterate through all the roles the user may have and check
    // to see if any one of them is in the list of permitted roles.
    let authorized = hook.params.auth.scopes.some(scope => scopes.indexOf(scope) !== -1);

    if (!authorized) {
      throw new errors.Forbidden('You do not have valid permissions to access this.');
    }

    return hook;
  }
}
