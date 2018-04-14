// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    context.params.query.listed = false;
    return context;
  };
};
