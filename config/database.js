module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DB_HOST', '127.0.0.1'),
      port: env.int('DB_PORT', 5432),
      database: env('DB_NAME', 'strapi'),
      user: env('DB_USER', 'strapi'),
      password: env('DB_PASS', 'strapi'),
      ssl: env.bool('DB_SSL', false) && {
        rejectUnauthorized: env.bool('DB_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    pool: {
      min: env.int('DB_POOL_MIN', 2),
      max: env.int('DB_POOL_MAX', 10),
    },
  },
});
