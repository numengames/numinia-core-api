import Joi from 'joi';
import { Request } from 'express';

import { paramNotValidError } from '../errors';

const schema = Joi.object({
  walletId: Joi.string().trim(),
  score: Joi.number().required(),
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
