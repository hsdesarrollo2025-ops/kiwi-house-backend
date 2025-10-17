'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/auth/local/login',
      handler: 'login.login',
      config: {
        auth: false,
      },
    },
  ],
};

