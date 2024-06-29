import { Request } from 'express';
import Joi from 'joi';

import { paramNotValidError } from '../errors';

const schema = Joi.object({
  walletId: Joi.string().trim(),
  userName: Joi.string().trim(),
  season: Joi.number().required(),
  spaceUrl: Joi.string().trim().required(),
  spaceName: Joi.string().trim().required(),
}).required();

export default async (body: Request['body']) => {
  try {
    const response = await schema.validateAsync(body);
    return response;
  } catch (error: unknown) {
    throw paramNotValidError((error as Joi.ValidationError).message);
  }
};
