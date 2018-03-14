// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const validate = require('jsonschema').validate;
const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (schema) {

  return async context => {

    if (context.type != 'before') {
      throw new Error(`validate-json-schema hook should be used as before hook`);
    }

    if (context.method != 'create' && context.method != 'update' && context.method != 'patch') {
      throw new Error(`validate-json-schema hook should only be used on create, update & patch methods`);
    }

    var result = validate(context.data, schema);
    console.log(result);

    if (!result.valid) {
      var error_messages = {};

      result.errors.forEach((error) => {
        error_messages[error.property] = error.stack;
      })

      throw new errors.BadRequest(error_messages);
    }

    return context;
  };
};
