import { Request } from 'express';
import Joi from 'joi';

import { paramNotValidError } from '../errors';

export const schema = Joi.object({
  walletId: Joi.string().trim().required(),
  deliverOption: Joi.string().trim().required(),
}).required();

export default async (body: Request['body']) => {
  try {
    const response = await schema.validateAsync(body);
    return response;
  } catch (error: unknown) {
    throw paramNotValidError((error as Joi.ValidationError).message);
  }
};
