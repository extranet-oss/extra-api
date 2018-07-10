// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    function cleanBefore(object) {
      for (let key in object) {
        if (object.hasOwnProperty(key) && key.startsWith('_'))
          delete object[key];
      }
    }

    function cleanAfter(object) {
      if (object._id)
        object.id = object._id;

      for (let key in object) {
        if (object.hasOwnProperty(key) && key.startsWith('_'))
          delete object[key];
      }
    }

    if (context.type == 'before' && context.data) {

      if (Array.isArray(context.data))
        context.data.forEach(cleanBefore);
      else
        cleanBefore(context.data);
    }

    else if (context.type == 'after') {

      let data = context.result.data || context.result;

      if (Array.isArray(data))
        data.forEach(cleanAfter);
      else
        cleanAfter(data);

    }

    return context;
  };
};
