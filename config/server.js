module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', process.env.PORT || 1337),
  url: env('RENDER_EXTERNAL_URL', `http://0.0.0.0:${process.env.PORT || 1337}`),
  app: {
    keys: env.array('APP_KEYS', ['key1', 'key2']),
  },
});
