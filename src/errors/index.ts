import Boom from '@hapi/boom';

const badData = (message?: string) => Boom.badData(message);
const conflict = (message?: string) => Boom.conflict(message);
const notFound = (message?: string) => Boom.notFound(message);

export const paramNotValidError = badData;
export const gameNotExistError = notFound;
export const conversationNotExistError = notFound;
