module.exports = ({ env }) => ({
  keys: env.array('APP_KEYS', ['toBeReplaced', 'withProperValues']),
});
