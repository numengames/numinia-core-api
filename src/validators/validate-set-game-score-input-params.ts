import { Request } from 'express';
import Joi from 'joi';

import { paramNotValidError } from '../errors';

const schema = Joi.object({
  score: Joi.number(),
  walletId: Joi.string().trim(),
  timer: Joi.number().required(),
  name: Joi.string().trim().required(),
}).required();

export default async (body: Request['body']) => {
  try {
    const response = await schema.validateAsync(body);
    return response;
  } catch (error: unknown) {
    throw paramNotValidError((error as Joi.ValidationError).message);
  }
};
