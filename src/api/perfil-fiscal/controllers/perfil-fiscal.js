'use strict';

const inicializar = async (ctx) => {
  try {
    const userId = ctx.state.user?.id;
    if (!userId) return ctx.unauthorized('Usuario no autenticado.');

    const existing = await strapi.db
      .query('api::perfil-fiscal.perfil-fiscal')
      .findOne({ where: { user: userId } });

    if (existing) {
      return ctx.conflict('El usuario ya tiene un perfil fiscal creado.');
    }

    const user = await strapi.db
      .query('plugin::users-permissions.user')
      .findOne({
        where: { id: userId },
        select: ['firstName', 'lastName', 'email', 'cuit'],
      });

    const now = new Date();

    const perfil = await strapi.db
      .query('api::perfil-fiscal.perfil-fiscal')
      .create({
        data: {
          user: userId,
          estado: 'borrador',
          seccionCompletada: null,
          progreso: 0,
          autosave: false,
          fechaCreacion: now,
          fechaActualizacion: now,
          nombre: user?.firstName || null,
          apellido: user?.lastName || null,
          email: user?.email || null,
          cuit: user?.cuit || null,
        },
      });

    ctx.send({
      mensaje: 'Perfil fiscal inicializado correctamente.',
      perfil,
    });
  } catch (error) {
    strapi.log.error('Error al inicializar perfil fiscal:', error);
    ctx.internalServerError('Ocurrió un error al crear el perfil fiscal.');
  }
};

module.exports = { inicializar };

