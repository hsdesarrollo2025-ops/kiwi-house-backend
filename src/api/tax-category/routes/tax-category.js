'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/tax-categories',
      handler: 'tax-category.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/tax-categories/:id',
      handler: 'tax-category.findOne',
      config: { auth: false },
    },
  ],
};

