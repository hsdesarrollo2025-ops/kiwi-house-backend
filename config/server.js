module.exports = ({ env }) => ({
  host: '0.0.0.0',
  port: env.int('PORT', 1337),
  url: env('RENDER_EXTERNAL_URL', `http://0.0.0.0:${env.int('PORT', 1337)}`),
  app: {
    keys: env.array('APP_KEYS', ['your-key-1', 'your-key-2', 'your-key-3', 'your-key-4']),
  },
});
