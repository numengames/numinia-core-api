import Joi from 'joi';
import { Request } from 'express';

import { paramNotValidError } from '../errors';

export const schema = Joi.object({
  id: Joi.string().trim().required(),
  platform: Joi.string().trim().required(),
  playerName: Joi.string().trim().required(),
}).required();

export default async (body: Request['body']) => {
  try {
    const response = await schema.validateAsync(body);
    return response;
  } catch (error: unknown) {
    throw paramNotValidError((error as Joi.ValidationError).message);
  }
};
