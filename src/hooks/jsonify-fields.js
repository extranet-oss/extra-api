// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (fields = []) {

  if (!Array.isArray(fields)) {
    fields = [ fields ];
  }

  return async context => {

    if (context.type != 'before' && context.type != 'after') {
      throw new Error(`jsonify-fields hook can only be used in before & after contexts`);
    }

    function process_fields(data) {
      fields.forEach((field) => {
        if (data.hasOwnProperty(field)) {
          if (context.type == 'before')
            data[field] = JSON.stringify(data[field]);
          else if (context.type == 'after')
            data[field] = JSON.parse(data[field]);
        }
      });
    }

    if (context.type == 'before' && context.method == 'create' && context.method == 'update' && context.method == 'patch')
      process_fields(context.data);
    else if (context.type == 'after' && context.method == 'find')
      context.result.data.forEach((data) => process_fields(data));
    else if (context.type == 'after')
      process_fields(context.result);

    return context;
  };
};
