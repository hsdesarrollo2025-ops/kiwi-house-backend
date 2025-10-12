'use strict';

const _ = require('lodash');
const { concat, compact, isArray } = require('lodash/fp');
const utils = require('@strapi/utils');

const {
  contentTypes: { getNonWritableAttributes },
  sanitize,
} = utils;

const { ApplicationError, ValidationError } = utils.errors;

const getService = (name) => strapi.plugin('users-permissions').service(name);

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');
  return sanitize.contentAPI.output(user, userSchema, { auth });
};

module.exports = {
  async register(ctx) {
    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
    const settings = await pluginStore.get({ key: 'advanced' });

    if (!settings.allow_register) {
      throw new ApplicationError('Register action is currently disabled');
    }

    const { register } = strapi.config.get('plugin.users-permissions');

    // Base allowed keys + custom fields to accept during registration
    const alwaysAllowedKeys = [
      'username',
      'password',
      'email',
      'firstName',
      'lastName',
      'cuit',
      'planType',
      'acceptedTerms',
    ];

    const userModel = strapi.contentTypes['plugin::users-permissions.user'];
    const { attributes } = userModel;
    const nonWritable = getNonWritableAttributes(userModel);

    const allowedKeys = compact(
      concat(
        alwaysAllowedKeys,
        isArray(register?.allowedFields)
          ? register.allowedFields
          : Object.keys(attributes).filter(
              (key) =>
                !nonWritable.includes(key) &&
                !attributes[key].private &&
                ![
                  'confirmed',
                  'blocked',
                  'confirmationToken',
                  'resetPasswordToken',
                  'provider',
                  'id',
                  'role',
                  'createdAt',
                  'updatedAt',
                  'createdBy',
                  'updatedBy',
                  'publishedAt',
                  'strapi_reviewWorkflows_stage',
                ].includes(key)
            )
      )
    );

    const params = {
      ..._.pick(ctx.request.body, allowedKeys),
      provider: 'local',
    };

    // Custom validations
    if (!params.password || params.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    if (!params.firstName || !params.lastName) {
      throw new ValidationError('firstName and lastName are required');
    }

    if (params.acceptedTerms !== true) {
      throw new ValidationError('You must accept the terms');
    }

    const allowedPlans = ['free', 'pro', 'premium'];
    if (params.planType && !allowedPlans.includes(params.planType)) {
      throw new ValidationError('Invalid planType');
    }

    // Run default body validation (keeps plugin validation behavior for core fields)
    const { validateRegisterBody } = require('@strapi/plugin-users-permissions/server/controllers/validation/auth');
    await validateRegisterBody(_.pick(params, ['username', 'password', 'email', 'provider']));

    const role = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: settings.default_role } });

    if (!role) {
      throw new ApplicationError('Impossible to find the default role');
    }

    const { email, username, provider } = params;

    const identifierFilter = {
      $or: [
        { email: email.toLowerCase() },
        { username: email.toLowerCase() },
        { username },
        { email: username },
      ],
    };

    const conflictingUserCount = await strapi.query('plugin::users-permissions.user').count({
      where: { ...identifierFilter, provider },
    });

    if (conflictingUserCount > 0) {
      throw new ApplicationError('Email or Username are already taken');
    }

    if (settings.unique_email) {
      const conflicting = await strapi.query('plugin::users-permissions.user').count({
        where: { ...identifierFilter },
      });

      if (conflicting > 0) {
        throw new ApplicationError('Email or Username are already taken');
      }
    }

    const newUser = {
      username,
      password: params.password,
      role: role.id,
      email: email.toLowerCase(),
      provider,
      confirmed: !settings.email_confirmation,
      // custom fields
      firstName: params.firstName,
      lastName: params.lastName,
      cuit: params.cuit,
      planType: params.planType || 'free',
      acceptedTerms: Boolean(params.acceptedTerms),
    };

    const user = await getService('user').add(newUser);
    const sanitizedUser = await sanitizeUser(user, ctx);

    if (settings.email_confirmation) {
      try {
        await getService('user').sendConfirmationEmail(sanitizedUser);
      } catch (err) {
        throw new ApplicationError(err.message);
      }

      return ctx.send({ user: sanitizedUser });
    }

    const jwt = getService('jwt').issue(_.pick(user, ['id']));

    return ctx.send({
      jwt,
      user: sanitizedUser,
    });
  },
};

