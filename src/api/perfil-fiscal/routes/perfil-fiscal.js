'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/perfil-fiscal/inicializar',
      handler: 'perfil-fiscal.inicializar',
      config: { auth: false },
    },
  ],
};
