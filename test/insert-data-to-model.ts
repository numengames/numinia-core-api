import { faker } from '@faker-js/faker';
import {
  ConversationChunkModel,
  ConversationModel,
  GameModel,
  PlayerModel,
  PlayerSessionModel,
  constants,
  types as modelTypes,
  interfaces as modelInterfaces,
  mongoose,
} from '@numengames/numinia-models';

import generateStringRandomNumber from './utils/generate-random-string-number';

export async function insertConversation(
  params: Partial<modelInterfaces.ConversationAttributes> = {},
): Promise<modelInterfaces.ConversationAttributes> {
  const parsedParams: Partial<modelInterfaces.ConversationAttributes> = {
    name: params.name || faker.lorem.word(),
    conversationId: params.conversationId || `conversation-${generateStringRandomNumber(10)}`,
    type: params.type || constants.ConversationTypes.CHATGPT,
    origin: params.origin || constants.ConversationOrigins.DISCORD,
  };

  if (params.model) {
    parsedParams.model = params.model;
  } else if (params.assistant) {
    parsedParams.assistant = params.assistant;
  } else {
    parsedParams.model = 'gpt-4o'; // By default, we set one
  }

  if (params.player) {
    parsedParams.player = params.player;
  }

  return ConversationModel.create(parsedParams);
}

interface InsertConversationChunkParams extends Partial<modelInterfaces.ConversationChunkAttributes> {
  message?: string;
}

export async function insertConversationChunk(
  params: InsertConversationChunkParams = {},
): Promise<modelInterfaces.ConversationChunkAttributes> {
  const parsedParams: Partial<modelInterfaces.ConversationChunkAttributes> = {
    role: params.role || faker.helpers.arrayElement(['assistant', 'user']),
    value: params.message || faker.lorem.lines(1),
    format: params.format || constants.ConversationChunkFormat.TEXT,
    conversationId: params.conversationId || `conversation-${generateStringRandomNumber(10)}`,
  };

  return ConversationChunkModel.create(parsedParams);
}

export async function insertGame(
  params: Record<string, unknown> = {},
): Promise<modelInterfaces.GameAttributes> {
  const parsedParams: Partial<modelInterfaces.GameAttributes> = {
    name: (params.name as string) || faker.word.words(),
    origin: (params.origin as string) || faker.helpers.arrayElement(['oncyber', 'hyperfy']),
    isActive: (params.isActive as boolean) || faker.helpers.arrayElement([true, false]),
    mode: (params.mode as string) || faker.word.words(),
    difficulty: (params.difficulty as number) || faker.number.int({ min: 1, max: 5 }),
    averageTime: (params.timer as number) || faker.number.int({ min: 1, max: 1000 }),
  };

  return GameModel.create(parsedParams);
}

interface InsertPlayerParams extends Partial<modelInterfaces.PlayerAttributes> {
}

export async function insertPlayer(params: Partial<modelInterfaces.PlayerAttributes> = {}): Promise<modelTypes.PlayerDocument> {
  const query: Partial<modelInterfaces.PlayerAttributes> = {
    lastConnectionDate: new Date(),
    oncyberId: faker.string.uuid(),
    hyperfyId: faker.string.uuid(),
    playerName: faker.internet.userName(),
    isActive: faker.helpers.arrayElement([true, false]),
    isBlocked: faker.helpers.arrayElement([true, false]),
  };

  return PlayerModel.create({
    ...query,
    ...params,
  });
}

export async function insertPlayerSession(params: Partial<modelInterfaces.PlayerSessionAttributes> = {}): Promise<modelTypes.PlayerSessionDocument> {
  const query: Partial<modelInterfaces.PlayerSessionAttributes> = {
    startAt: new Date(),
    userAgent: faker.internet.userAgent(),
    spaceName: faker.lorem.words(3).replace(' ', '_'),
    platform: faker.helpers.arrayElement(['Mobile', 'PC']),
    isAnonymous: faker.helpers.arrayElement([true, false]),
  };

  return PlayerSessionModel.create({
    ...query,
    ...params,
  });
}
