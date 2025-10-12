'use strict';

module.exports = {
  async register(ctx) {
    const body = ctx.request.body || {};
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      cuit,
      planType,
      acceptedTerms,
    } = body;

    // Basic presence validations
    if (!email || !username || !password) {
      return ctx.badRequest('username, email and password are required');
    }

    // Password length validation
    if (String(password).length < 8) {
      return ctx.badRequest('Password must be at least 8 characters');
    }

    const lowerEmail = String(email).toLowerCase();

    // Check email uniqueness
    const existing = await strapi
      .db
      .query('plugin::users-permissions.user')
      .findOne({ where: { email: lowerEmail } });

    if (existing) {
      return ctx.conflict('Email already registered');
    }

    // Create user with custom fields
    const newUserData = {
      username,
      email: lowerEmail,
      password,
      provider: 'local',
      confirmed: true,
      blocked: false,
      firstName,
      lastName,
      cuit,
      planType: planType || 'free',
      acceptedTerms: acceptedTerms === true,
    };

    const user = await strapi
      .db
      .query('plugin::users-permissions.user')
      .create({ data: newUserData });

    // Issue JWT
    const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });

    // Public user payload
    const publicUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      cuit: user.cuit,
      planType: user.planType,
      acceptedTerms: user.acceptedTerms,
    };

    return ctx.send({ jwt, user: publicUser });
  },
};
