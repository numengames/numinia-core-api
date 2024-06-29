import Joi from 'joi';
import { Request } from 'express';

import {
  schema as discordWebhookLoginLogoutSchema
} from './validate-discord-send-webhook-login-logout-input-params';
import { paramNotValidError } from '../errors';

const schema = discordWebhookLoginLogoutSchema
  .concat(Joi.object({ text: Joi.string().trim().required() }));

export default async (body: Request['body']) => {
  try {
    const response = await schema.validateAsync(body);
    return response;
  } catch (error: unknown) {
    throw paramNotValidError((error as Joi.ValidationError).message);
  }
};
