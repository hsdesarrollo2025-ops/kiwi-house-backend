'use strict';

module.exports = {
  routes: [
    // Init profile
    { method: 'POST', path: '/fiscal-profile/init', handler: 'fiscal-profile.init', config: { auth: false } },
    // Section A
    { method: 'PUT', path: '/fiscal-profile/section/A', handler: 'fiscal-profile.updateSectionA', config: { auth: false } },
    { method: 'PUT', path: '/fiscal-profile/section/B', handler: 'fiscal-profile.updateSectionB', config: { auth: false } },
    // Get by user id
    { method: 'GET', path: '/fiscal-profile/:userId', handler: 'fiscal-profile.getByUser', config: { auth: false } },
    // Finalize
    { method: 'PUT', path: '/fiscal-profile/finalize', handler: 'fiscal-profile.finalize', config: { auth: false } },
    // Validations
    { method: 'GET', path: '/fiscal-profile/validate-cuit/:cuit', handler: 'fiscal-profile.validateCuit', config: { auth: false } },
    { method: 'GET', path: '/fiscal-profile/validate-category', handler: 'fiscal-profile.validateCategory', config: { auth: false } },
  ],
};
