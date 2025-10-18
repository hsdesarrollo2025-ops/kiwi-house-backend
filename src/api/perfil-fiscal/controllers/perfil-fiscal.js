'use strict';

const inicializar = async (ctx) => {
  try {
    // Extraer y verificar JWT manualmente para no depender de policies
    const auth = ctx.request.header?.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return ctx.unauthorized('Usuario no autenticado.');

    let payload;
    try {
      payload = await strapi.plugins['users-permissions'].services.jwt.verify(token);
    } catch (e) {
      return ctx.unauthorized('Usuario no autenticado.');
    }

    const userId = payload?.id;
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

const actualizarSeccionA = async (ctx) => {
  try {
    const auth = ctx.request.header?.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return ctx.unauthorized('Usuario no autenticado.');

    let payload;
    try {
      payload = await strapi.plugins['users-permissions'].services.jwt.verify(token);
    } catch (e) {
      return ctx.unauthorized('Usuario no autenticado.');
    }

    const userId = payload?.id;
    if (!userId) return ctx.unauthorized('Usuario no autenticado.');

    const perfil = await strapi.db
      .query('api::perfil-fiscal.perfil-fiscal')
      .findOne({ where: { user: userId } });

    if (!perfil) return ctx.notFound('No se encontró el perfil fiscal del usuario.');

    const data = ctx.request.body || {};
    const errores = [];

    if (!data.nombre || data.nombre.length < 2)
      errores.push('El nombre debe tener al menos 2 caracteres.');
    if (!data.apellido || data.apellido.length < 2)
      errores.push('El apellido debe tener al menos 2 caracteres.');
    if (!['DNI', 'Pasaporte', 'Otro'].includes(data.tipoDocumento))
      errores.push('Tipo de documento inválido.');
    if (!/^[0-9]{7,10}$/.test(data.nroDocumento || ''))
      errores.push('El número de documento debe tener entre 7 y 10 dígitos.');
    if (!/^[0-9]{11}$/.test(data.cuit || ''))
      errores.push('El CUIT debe tener 11 dígitos numéricos.');

    const validarCuit = (cuit) => {
      const nums = cuit.split('').map(Number);
      const coef = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
      const suma = coef.reduce((acc, val, i) => acc + val * nums[i], 0);
      const resto = suma % 11;
      const verificador = resto === 0 ? 0 : resto === 1 ? 9 : 11 - resto;
      return verificador === nums[10];
    };
    if (data.cuit && !validarCuit(data.cuit))
      errores.push('El CUIT ingresado no es válido.');

    if (!data.domicilioCalle) errores.push('El campo domicilioCalle es obligatorio.');
    if (!data.domicilioNumero) errores.push('El campo domicilioNumero es obligatorio.');
    if (!data.localidad) errores.push('El campo localidad es obligatorio.');
    if (!data.provincia) errores.push('Debe seleccionar una provincia.');
    if (!/^[0-9]{4,5}$/.test(data.codigoPostal || ''))
      errores.push('Código postal inválido (4-5 dígitos).');
    if (!/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(data.email || ''))
      errores.push('Email con formato inválido.');
    if (data.telefono && !/^[0-9]{8,15}$/.test(data.telefono))
      errores.push('El teléfono debe tener entre 8 y 15 dígitos.');

    if (errores.length > 0) return ctx.unprocessableEntity({ errores });

    const actualizado = await strapi.db
      .query('api::perfil-fiscal.perfil-fiscal')
      .update({
        where: { id: perfil.id },
        data: {
          ...data,
          seccionCompletada: 'A',
          progreso: 33,
          fechaActualizacion: new Date(),
        },
      });

    ctx.send({
      mensaje: 'Sección A guardada correctamente.',
      perfil: actualizado,
    });
  } catch (error) {
    strapi.log.error('Error al guardar Sección A:', error);
    ctx.internalServerError('Ocurrió un error al guardar la sección.');
  }
};

module.exports = { inicializar, actualizarSeccionA };
