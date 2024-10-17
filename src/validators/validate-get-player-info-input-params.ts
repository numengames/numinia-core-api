import Joi from 'joi';
import { Request } from 'express';

import { paramNotValidError } from '../errors';

export const schema = Joi.object({
  id: Joi.string().required(),
  platform: Joi.string().valid('oncyber', 'hyperfy', 'user').required(),
}).required();

export default async (params: Request['params']) => {
  try {
    const response = await schema.validateAsync(params);
    return response;
  } catch (error: unknown) {
    throw paramNotValidError((error as Joi.ValidationError).message);
  }
};