'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/perfil-fiscal/inicializar',
      handler: 'perfil-fiscal.inicializar',
      config: {
        policies: ['plugin::users-permissions.jwt'],
      },
    },
  ],
};
