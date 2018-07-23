// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const ObjectID64 = require('objectid64')();
const { NotFound } = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {

  function decode(id) {
    if (!/^[0-9A-Za-z_-]{16}$/.test(id))
      throw new NotFound(`No record found for id '${id}'`);

    return ObjectID64.decode(id);
  }

  function encode(id) {
    return ObjectID64.encode(id.toString());
  }

  function cleanAfter(data) {
    if (data._id)
      data._id = encode(data._id);
  }

  return async context => {

    if (context.type == 'before' && context.id)
      context.id = decode(context.id);

    if (context.type == 'after') {

      let data = context.result.data || context.result;

      if (Array.isArray(data))
        data.forEach(cleanAfter);
      else
        cleanAfter(data);
    }
  };
};
