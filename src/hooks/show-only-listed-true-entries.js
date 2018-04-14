// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.params.provider) {
      context.params.query.listed = true;
    }
    return context;
  };
};
