// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const ObjectID64 = require('objectid64')();
const { BadRequest } = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {

  function decode(id, path) {
    if (!/^[0-9A-Za-z_-]{16}$/.test(id))
      throw new BadRequest(`Invalid identifier value "${id}" at path "${path}"`);

    return ObjectID64.decode(id);
  }

  function encode(id) {
    return ObjectID64.encode(id.toString());
  }

  function cleanBefore(data, prefix = '') {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === 'object')
          cleanAfter(data[key], `${key}.`)
        else if (typeof data[key] === 'string' && key.endsWith('_id'))
          data[key] = decode(data[key], `${prefix}${key}`);
      }
    }
  }

  function cleanAfter(data) {
    for (let key in data) {
      if (data.hasOwnProperty(key) && key.endsWith('_id'))
          data[key] = encode(data[key]);
    }
  }

  return async context => {

    if (context.type == 'before' && context.id)
      context.id = decode(context.id, 'id');


    if (context.type == 'before' && context.data) {

      if (Array.isArray(context.data))
        context.data.forEach(cleanBefore);
      else
        cleanBefore(context.data);
    }

    if (context.type == 'before' && context.params.query) {
      for (let key in context.params.query) {
        if (context.params.query.hasOwnProperty(key) && key.endsWith('_id'))
            context.params.query[key] = decode(context.params.query[key], key);
      }
    }

    if (context.type == 'after') {

      let data = context.result.data || context.result;

      if (Array.isArray(data))
        data.forEach(cleanAfter);
      else
        cleanAfter(data);
    }
  };
};
