import Joi from 'joi';
import { Request } from 'express';

const joiObjectId = require('joi-objectid')(Joi);

import { paramNotValidError } from '../errors';

export const schema = Joi.object({
  playerId: joiObjectId().required(),
  rewardId: joiObjectId().required(),
}).required();

export default async (params: Request['params' | 'body']) => {
  try {
    const response = await schema.validateAsync(params);
    return response;
  } catch (error: unknown) {
    throw paramNotValidError((error as Joi.ValidationError).message);
  }
};
