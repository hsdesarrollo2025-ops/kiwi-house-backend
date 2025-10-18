'use strict';

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/perfil-fiscal/inicializar',
      handler: 'perfil-fiscal.inicializar',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/perfil-fiscal/seccion/A',
      handler: 'perfil-fiscal.actualizarSeccionA',
      config: { auth: false },
    },
  ],
};
