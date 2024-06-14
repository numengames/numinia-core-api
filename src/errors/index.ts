import Boom from '@hapi/boom';

const badData = (message?: string) => Boom.badData(message);
const notFound = (message?: string) => Boom.notFound(message);

export const paramNotValidError = badData;
export const userNotExistError = notFound;
export const gameNotExistError = notFound;
export const conversationNotExistError = notFound;
export const userHasNotInternalAccountError = notFound;
