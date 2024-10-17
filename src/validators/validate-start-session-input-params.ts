import Joi from 'joi';
import { Request } from 'express';

import { paramNotValidError } from '../errors';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const schema = Joi.object({
  userAgent: Joi.string().trim(),
  platform: Joi.string().trim().required(),
  spaceName: Joi.string().trim().required(),
  playerId: Joi.string().trim().pattern(objectIdRegex),
}).required();

export default async (body: Request['body']) => {
  try {
    const response = await schema.validateAsync(body);
    return response;
  } catch (error: unknown) {
    throw paramNotValidError((error as Joi.ValidationError).message);
  }
};
